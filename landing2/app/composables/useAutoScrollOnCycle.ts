



export const useAutoScrollOnCycle = () => {
    function scroll() {
        scrollTo(0, document.body.offsetHeight)
    }
    
    return {
        scroll,
    }
}