// src/composables/useMessageReadObserver.ts
import { onBeforeUnmount, ref } from "vue";

type Options = {
  /** контейнер скролла (если не окно). передай ref на элемент */
  root?: HTMLElement | null;
  /** сколько должно попасть в зону видимости */
  threshold?: number;
  /** "засчитывать" сообщение видимым, когда оно ближе к центру */
  rootMargin?: string; // например "0px 0px -40% 0px"
  /** задержка перед отправкой */
  debounceMs?: number;
  /** кого считаем "не моими" (не помечаем свои) */
  isOwnMessage?: (messageId: number) => boolean;
};

export function useMessageReadObserver(
  onRead: (lastVisibleMessageId: number) => void,
  opts: Options = {}
) {
  const {
    root = null,
    threshold = 0.6,
    rootMargin = "0px 0px -35% 0px",
    debounceMs = 250,
    isOwnMessage,
  } = opts;

  const observedIds = new Set<number>();
  const visibleIds = new Set<number>();

  const lastSentId = ref<number>(0);

  let observer: IntersectionObserver | null = null;
  let timer: number | null = null;

  const flush = () => {
    timer = null;

    // берём максимальный id среди видимых
    let maxId = 0;
    for (const id of visibleIds) {
      if (id > maxId) maxId = id;
    }

    // не отправляем назад/дубли
    if (maxId > lastSentId.value) {
      lastSentId.value = maxId;
      onRead(maxId);
    }
  };

  const scheduleFlush = () => {
    if (timer !== null) window.clearTimeout(timer);
    timer = window.setTimeout(flush, debounceMs);
  };

  const ensureObserver = () => {
    if (observer) return;

    observer = new IntersectionObserver(
      (entries) => {
        let changed = false;

        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          const idStr = el.dataset.messageId;
          if (!idStr) continue;

          const id = Number(idStr);
          if (!Number.isFinite(id)) continue;

          // если это "моё" сообщение — игнорим для read-логики
          if (isOwnMessage?.(id)) {
            if (visibleIds.delete(id)) changed = true;
            continue;
          }

          if (entry.isIntersecting) {
            if (!visibleIds.has(id)) {
              visibleIds.add(id);
              changed = true;
            }
          } else {
            if (visibleIds.delete(id)) changed = true;
          }
        }

        if (changed) scheduleFlush();
      },
      { root, threshold, rootMargin }
    );
  };

  /**
   * Вешаем на DOM-элемент сообщения.
   * Пример: <div :ref="(el) => register(el, msg.id)" ... />
   */
  const register = (el: Element | null, messageId: number) => {
    if (!el) return;
    ensureObserver();

    const htmlEl = el as HTMLElement;
    htmlEl.dataset.messageId = String(messageId);

    if (!observedIds.has(messageId)) {
      observedIds.add(messageId);
      observer!.observe(htmlEl);
    }
  };

  const unobserveAll = () => {
    if (observer) observer.disconnect();
    observer = null;
    observedIds.clear();
    visibleIds.clear();
    if (timer !== null) window.clearTimeout(timer);
    timer = null;
    lastSentId.value = 0;
  };

  onBeforeUnmount(() => {
    unobserveAll();
  });

  return {
    register,
    unobserveAll,
    lastSentId,
  };
}
