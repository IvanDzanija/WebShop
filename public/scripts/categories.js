const categories = document.querySelectorAll('.category');
function toggleCategory(categoryId) {
    categories.forEach(category => {
        if (category.id === categoryId) {
            category.style.display = 'block';
        } else {
            category.style.display = 'none';
        }
    });
}

const categoryLinks = document.querySelectorAll('.categories ul li a');
categoryLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const categoryId = link.getAttribute('href').substring(1);
        toggleCategory(categoryId);
    });
});
