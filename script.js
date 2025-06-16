// Carrossel - Seção de Depoimentos

// Elementos do carrossel
const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const arrowBtns = document.querySelectorAll(".wrapper button");
const firstCardWith = carousel.querySelector(".card").offsetWidth;
const indicators = document.querySelectorAll(".indicador");

// Variáveis de controle
let isDragging = false, startX, startScrollLeft, timeOutId;
// Quantidade de cards que serão exibidos por vez (com base na largura)
let cardPerView = Math.round(carousel.offsetWidth / firstCardWith);
// Indice do card central (com base na quantidade de cards exibidos)
let currentActiveIndex = cardPerView;
// Cards do carrossel
const carouselChildrens = [...carousel.children];

// Atualiza os indicadores
const updateIndicators = () => {
    const indicators_actives = document.querySelectorAll(".indicador.active");

    // Remove a classe "active" de todos os indicadores
    indicators_actives.forEach(indicator => {
        indicator.classList.remove("active");
    });
    // Verifica qual indicador deve ser ativo (baseado no card central atual)
    let relativeIndex = currentActiveIndex - cardPerView;
    // Verifica qual indicador deve ser ativo de acordo com o card central
    if (relativeIndex > 0 && relativeIndex <= 3) {
        indicators[0].classList.add("active")
    } else {
        indicators[1].classList.add("active")
    }
};

// Atualiza o card central
const updateActiveCardByScroll = () => {
    // Pega posição e tamanho do carrossel
    const carouselRect = carousel.getBoundingClientRect(); 
    // Calcula o ponto central do carrossel (eixo X)
    const centerX = carouselRect.left + carousel.offsetWidth / 2; 
    // Card mais próximo do centro
    let closestCard = null;
    // Distância mais próxima do centro até agora
    let closestDistance = Infinity; 
    // Pega os cards dentro do carrossel
    let allCards = carousel.querySelectorAll(".card");

    // Percorre todos os cards dentro do carrossel
    allCards.forEach((card, index) => {
        // Pega a posição e o tamanho do card
        const cardRect = card.getBoundingClientRect();
        // Calcula o centro do card
        const cardCenter = cardRect.left + cardRect.width / 2;
        // Distância entre o centro do carrossel e o card
        const distance = Math.abs(centerX - cardCenter);

         // Verifica se o card atual está mais próximo do centro da tela que o último
        if (distance < closestDistance) {
            // Atualiza o card mais próximo do centro
            closestDistance = distance;
            closestCard = card;
            // Salva o índice central
            currentActiveIndex = index; 
        }
    });

    // Remove a classe "active" de todos os cards atualmente ativos
    allCards.forEach(card => card.classList.remove("active"));

    // Verifica o tamanho da tela e adiciona a classe "active" ao card central
    if (window.innerWidth >= 1180 && closestCard) closestCard.classList.add("active");
};

// Percorre todos os indicadores
indicators.forEach((indicator, index) => {
    const indicators_actives = document.querySelectorAll(".indicador.active");
    
    // Evento de clique para cada indicador
    indicator.addEventListener("click", () => {
        // Armazena qual indicador foi clicado
        let targetIndex;
        // Remove classe "active" de todos os indicadores antes de adicionar no correto
        indicators_actives.forEach(i => i.classList.remove("active"));
        // Adiciona classe "active" ao indicador clicado
        indicator.classList.add("active");
        // Verifica qual indicador foi clicado
        if (index === 0) {
            // O primeiro indicador → primeiro card real
            targetIndex = cardPerView;
        } else {
            // O segundo indicador → último card real
            targetIndex = carouselChildrens.length - 1 + cardPerView
        }
        // Move o carrossel até o card desejado
        carousel.scrollLeft = targetIndex * firstCardWith;
        // Atualiza o card ativo com base na nova posição
        updateActiveCardByScroll();
    });
});

// Pega os últimos cards que são exibidos e inverte a ordem
carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
    // Insere os últimos cards no início do carrossel
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});
// Pega os primeiros cards que são exibidos
carouselChildrens.slice(0, cardPerView).forEach(card => {
    // Insere os primeiros cards no final do carrossel
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Ação dos botões do carrossel
arrowBtns.forEach(btn => {
    // Eventos de clique dos botões
    btn.addEventListener("click", () => {
        // Verifica qual botão foi clicado para mover o carrossel
        carousel.scrollLeft += btn.id === "left" ? -firstCardWith : firstCardWith;
        updateActiveCardByScroll();
        updateIndicators();
    })
})

// Evento de tocar no carrossel
const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");
    // Armazena a posição inicial do mouse
    startX = e.pageX;
    // Armazena a posição inicial do scroll
    startScrollLeft = carousel.scrollLeft;
}

// Evento de arrastar o mouse
const dragging = (e) => {
    // Verifica se o mouse estiver sendo arrastado
    if(!isDragging) return;
    // Move o carrossel com o mouse
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
}

// Evento de parar de arrastar o mouse
const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
    updateActiveCardByScroll();
    updateIndicators();
}

// Automatiza o carrossel
const autoPlay = () => {
    updateActiveCardByScroll();
    updateIndicators();
    
    // Evita que o setTimeout seja executado mais de uma vez
    timeOutId = setTimeout(() => {
        // Verifica o tamanho da tela e move o carrossel
        if (window.innerWidth < 1180 && window.innerWidth >= 865) {
            // Move o carrossel baseado na largura do card e no espaço entre eles
            carousel.scrollLeft += (firstCardWith + 24);
        }
        // Move o carrossel
        carousel.scrollLeft += firstCardWith;
    }, 3000);
}

// Efeito de Loop contínuo
const infiniteScroll = () => {
    // Variáveis que armazenam o valor inicial e final do scroll
    const atStart = carousel.scrollLeft === 0;
    const atEnd = Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth;

    // Verifica se uma das variáveis existe
    if (atStart || atEnd) {
        carousel.classList.add("no-transition");
        // Verifica se o scroll chegou ao inicio
        if (atStart) {
            // Faz o carrossel voltar ao fim
            carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
        } else {
            // Faz o carrossel voltar ao inicio
            carousel.scrollLeft = carousel.offsetWidth;
        }
        
        carousel.classList.remove("no-transition");
        return;
    }
    
    // Limpa o setTimeout para evitar execuções desnecessárias
    clearTimeout(timeOutId);
    // Verifica se o mouse não está sobre o carrossel
    if (!wrapper.matches(":hover")) autoPlay();
    updateActiveCardByScroll();
    updateIndicators();
};

// Inicialização das funções
autoPlay();
updateActiveCardByScroll();
updateIndicators();

// Eventos do carrossel
carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeOutId));
wrapper.addEventListener("mouseleave", autoPlay);

// Formulário - Seção de Novidades

// Verifica se o DOM foi carregado
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('signup-form');
    if (!form) return;

    const nameInput = form.elements['name'];
    const emailInput = form.elements['email'];
    const meditateInputs = form.elements['meditates'];

    const formMessage = document.getElementById('form-message');
    const meditateError = document.getElementById('meditate-error');

    const modalContainer = document.getElementById('alert');
    const msgModal = document.getElementById('alert-message');
    const triangleIcon = document.getElementById('triangle-alert');
    const badgeIcon = document.getElementById('badge-check');
    const closeBtn = document.querySelector('.close-button');
    const confirmBtn = document.getElementById('alert-confirm');

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.trim());
    }

    function isMeditationSelected() {
        return [...meditateInputs].some(input => input.checked);
    }

    function exibeModal(message, isSuccess = false) {
        msgModal.textContent = message;
        modalContainer.style.display = 'flex';

        triangleIcon.style.display = isSuccess ? 'none' : 'block';
        badgeIcon.style.display = isSuccess ? 'block' : 'none';

        function fechaModal() {
            modalContainer.style.display = 'none';
        }

        confirmBtn.addEventListener('click', fechaModal);
        closeBtn.addEventListener('click', fechaModal);
        window.addEventListener('click', event => {
            if (event.target === modalContainer) fechaModal();
        });
    }

    function validateInputs() {
        let valid = true;

        if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
            nameInput.setAttribute('aria-invalid', 'true');
            valid = false;
        } else {
            nameInput.removeAttribute('aria-invalid');
        }

        if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
            emailInput.setAttribute('aria-invalid', 'true');
            valid = false;
        } else {
            emailInput.removeAttribute('aria-invalid');
        }

        if (!isMeditationSelected()) {
            meditateError.style.display = 'block';
            valid = false;
        } else {
            meditateError.style.display = 'none';
        }

        return valid;
    }

    nameInput.addEventListener('input', () => {
        if (nameInput.value.trim().length >= 2) {
            nameInput.removeAttribute('aria-invalid');
        }
    });

    emailInput.addEventListener('input', () => {
        if (validateEmail(emailInput.value)) {
            emailInput.removeAttribute('aria-invalid');
        }
    });

    [...meditateInputs].forEach(radio => {
        radio.addEventListener('change', () => {
            meditateError.style.display = 'none';
        });
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        formMessage.textContent = '';

        if (!validateInputs()) {
            exibeModal('Todos os campos devem ser preenchidos corretamente.', false);
            return;
        }

        // Simulação de sucesso
        exibeModal('Cadastro realizado com sucesso!', true);
        console.log('Nome:', nameInput.value.trim());
        console.log('Email:', emailInput.value.trim());

        form.reset();
    });
});


// Não quero que ele fique em loop

const links = document.querySelectorAll(".ul li a");
links.forEach((link) => {
    link.addEventListener("click", () => {
        links.forEach((link) => {
            link.classList.remove("active");
        });
        link.classList.add("active");
    });
});

let currentSectionId = null;

window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section");
    const links = document.querySelectorAll(".ul li a");

    let newActiveSectionId = null;

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const offsetTrigger = 50;

        if ( window.scrollY >= sectionTop - offsetTrigger &&
            window.scrollY < sectionTop + sectionHeight - offsetTrigger) {
            newActiveSectionId = section.id;
        }

    });

    // Só atualiza se mudou de seção
    if (newActiveSectionId !== currentSectionId) {
        currentSectionId = newActiveSectionId;

        links.forEach((link) => {
            const href = link.getAttribute("href").replace("#", "");
            const header = document.querySelector("header");

            if (href === currentSectionId) {
                if (href === "sobre" || href === "depoimentos") {
                    header.classList.add("active");
                } else {
                    header.classList.remove("active");
                }
                
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    }
});