export function removeLoader() {
    const loader = document.querySelector('#loader');
    const container = document.querySelector('#content');
    loader.classList.add('hidden');
    container.classList.remove('hidden');

}
    
export function addLoader() {
    const loader = document.querySelector('#loader');
    const container = document.querySelector('#content');
    loader.classList.remove('hidden');
    container.classList.add('hidden');
}