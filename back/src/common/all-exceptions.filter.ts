import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        // Установка статуса по умолчанию
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';

        // Если это HttpException, используем её статус и сообщение
        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            message = typeof exceptionResponse === 'string'
                ? exceptionResponse
                : (exceptionResponse as any).message || message;
        } else {
            // Для неизвестных ошибок логируем детали
            console.error(`[Global Exception] ${request.method} ${request.url}`, exception);
        }

        // Отправляем ответ клиенту
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message,
        });
    }
}