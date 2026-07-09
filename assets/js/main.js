document.addEventListener("DOMContentLoaded", () => {

    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: !prefersReducedMotion,
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => { lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);

        lenis.stop();
        
        // Mede e posiciona o logo do preloader no início (antes do window load)
        const headerLogo = document.getElementById('header-logo');
        const preloaderLogo = document.getElementById('preloader-logo');
        if (headerLogo && preloaderLogo) {
            const headerRect = headerLogo.getBoundingClientRect();
            
            // Define a altura base para coincidir com a do header e mantém o aspect ratio
            gsap.set(preloaderLogo, {
                height: headerRect.height,
                width: "auto"
            });

            // Mede a largura resultante para alinhar perfeitamente
            const preloaderRect = preloaderLogo.getBoundingClientRect();
            let leftPos;
            if (window.innerWidth >= 768) {
                // No desktop: alinha à esquerda (junto com o início das letras PAV)
                leftPos = headerRect.left;
            } else {
                // No mobile: alinha o ponto central horizontal
                leftPos = (headerRect.left + headerRect.width / 2) - (preloaderRect.width / 2);
            }

            gsap.set(preloaderLogo, {
                left: leftPos,
                top: headerRect.top,
                transformOrigin: window.innerWidth >= 768 ? "left top" : "center top"
            });

            // Escala inicial de 50% da largura do desktop ou 80% do mobile
            const targetWidth = window.innerWidth * (window.innerWidth >= 768 ? 0.5 : 0.8);
            const initialScale = targetWidth / preloaderRect.width;
            
            gsap.set(preloaderLogo, {
                scale: initialScale
            });
        }
        
        // Finalização assíncrona do Preloader (De baixo para cima, escala o logo até 1)
        const finishLoading = () => {
            if (window.__preloaderFinished) return;
            window.__preloaderFinished = true;
            
            const preloaderTl = gsap.timeline({
                onComplete: () => {
                    const preloader = document.getElementById('preloader');
                    const preloaderContent = document.getElementById('preloader-content');
                    if (preloader) preloader.style.display = 'none';
                    if (preloaderContent) preloaderContent.style.display = 'none';
                    gsap.set("#header-logo", { opacity: 1 });
                    lenis.start();
                    ScrollTrigger.refresh(); 
                }
            });

            if (!prefersReducedMotion) {
                preloaderTl
                    // Anima o logo voltando para a escala original (1x)
                    .to("#preloader-logo", {
                        scale: 1,
                        duration: 1.2,
                        ease: "power3.inOut"
                    })
                    // Desliza o background preto de baixo para cima (yPercent: -100)
                    .to("#preloader", {
                        yPercent: -100,
                        duration: 1.2,
                        ease: "power3.inOut"
                    }, "<")
                    .to("#preloader-logo", {
                        opacity: 0,
                        duration: 0.1
                    }, "-=0.1");
            } else {
                preloaderTl.to("#preloader, #preloader-content", { opacity: 0, duration: 0.3 });
            }
        };

        // Verifica se o window já está carregado ou escuta o evento load
        if (document.readyState === 'complete') {
            finishLoading();
        } else {
            window.addEventListener('load', finishLoading);
            // Timeout de segurança para evitar travamentos
            setTimeout(finishLoading, 3000);
        }

        const textStrS2 = "Acreditamos em uma experiência visual estratégica, clara e pensada para gerar confiança antes da decisão.";
        const textContainerS2 = document.getElementById("animated-text");
        textContainerS2.innerHTML = textStrS2.split(" ").map(word => `<span class="word mr-1.5 md:mr-3">${word}</span>`).join("");

        gsap.timeline({
            scrollTrigger: { trigger: "#pin-master", start: "top top", end: "+=200%", pin: true, scrub: 1 }
        })
        .to(".curtain", { scaleY: 1, stagger: 0.05, duration: 1, ease: "power2.inOut" })
        .fromTo(".word", { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.05, duration: 1, ease: "power2.out" }, "-=0.4")
        .to({}, { duration: 0.5 });

        const titleStrS3 = "Projetos Recentes"; 
        const titleContainerS3 = document.getElementById("projects-title");
        titleContainerS3.innerHTML = titleStrS3.split("").map(char => char === " " ? `<span class="char">&nbsp;</span>` : `<span class="char">${char}</span>`).join("");

        // Animado de forma responsiva dentro de gsap.matchMedia()

        gsap.to(".s3-line", {
            y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: "power4.out",
            scrollTrigger: { trigger: "#section3", start: "top 65%", toggleActions: "play none none reverse" }
        });

        gsap.utils.toArray(".portfolio-card").forEach(card => {
            gsap.fromTo(card, 
                { clipPath: "inset(0% 50% 0% 50% round 40px)" },
                { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1.2, ease: "power3.inOut",
                  scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none reverse", onComplete: () => ScrollTrigger.refresh() }
                }
            );
        });

        let mm = gsap.matchMedia();

        // --- DESKTOP (Grid 2x2 Clássico) ---
        mm.add("(min-width: 768px)", () => {
            // Título com blur no desktop (GPU amigável em telas maiores)
            gsap.fromTo("#projects-title .char", 
                { opacity: 0, filter: "blur(16px)" },
                { opacity: 1, filter: "blur(0px)", stagger: 0.1, ease: "none",
                  scrollTrigger: { trigger: "#section3", start: "top 80%", end: "top 30%", scrub: 1 }
                }
            );

            const s4Tl = gsap.timeline({
                scrollTrigger: { trigger: "#section4", start: "top top", end: "+=500%", scrub: 1, pin: true }
            });

            gsap.set(".s4-card, #white-rect", { xPercent: -50, yPercent: -50 });
            gsap.set("#card-01 .s4-text", { opacity: 1, y: 0 }); // Show Card 01 text immediately
            gsap.set("#card-02, #card-03, #card-04", { autoAlpha: 0 });
            const gap = 3; 

            s4Tl.to({}, { duration: 0.5 }) 
                // Card 01 text is already visible from the start

                .to("#card-02", { autoAlpha: 1, duration: 0.1 }, "split") 
                .to("#card-01", { xPercent: gap, yPercent: -100 - gap, duration: 1.2, ease: "power2.inOut" }, "split")
                .to("#card-02", { xPercent: -100 - gap, yPercent: gap, duration: 1.2, ease: "power2.inOut" }, "split")
                // O texto do Card-02 surge suavemente conforme os cards se separam
                .to("#card-02 .s4-text", { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "split+=0.4")

                // Cards-03 e 04 começam a voar ANTES de terminar o split de 01 e 02 (overlap de 50%)
                .fromTo("#card-03", 
                    { autoAlpha: 0, xPercent: -100 - gap, yPercent: 100 + gap }, 
                    { autoAlpha: 1, xPercent: -100 - gap, yPercent: -100 - gap, duration: 1.2, ease: "power2.inOut" }, 
                    "split+=0.6"
                )
                .fromTo("#card-04", 
                    { autoAlpha: 0, xPercent: gap, yPercent: -100 - gap }, 
                    { autoAlpha: 1, xPercent: gap, yPercent: gap, duration: 1.2, ease: "power2.inOut" }, 
                    "split+=0.6"
                )
                // Textos dos Cards-03 e 04 surgem de forma sobreposta
                .to(["#card-03 .s4-text", "#card-04 .s4-text"], { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "split+=1.0")

                // Reduced pause to collapse cards much earlier
                .to({}, { duration: 0.4 }) 
                
                // 1. Colapsa os cards primeiro (eles se juntam no centro, com informações e números ainda visíveis)
                .to(".s4-card", { xPercent: -50, yPercent: -50, duration: 1.2, ease: "power2.inOut" }, "collapse")
                
                // 2. APÓS o colapso (cards juntos no centro), apaga as informações e números
                .to([".s4-text", ".s4-num"], { opacity: 0, duration: 0.4, ease: "power2.in" }, "collapse+=1.2")
                
                // Dynamic size matching to start expanding #white-rect at the exact dimensions of a card
                .set("#white-rect", {
                    width: () => {
                        const card = document.querySelector('#card-01');
                        return card ? card.getBoundingClientRect().width : "44vw";
                    },
                    height: () => {
                        const card = document.querySelector('#card-01');
                        return card ? card.getBoundingClientRect().height : "auto";
                    },
                    borderRadius: "16px"
                }, "collapse+=1.2")

                // 3. Simultaneamente, mostra a máscara branca (#white-rect) no tamanho exato do card
                .to("#white-rect", { opacity: 1, duration: 0.4 }, "collapse+=1.2")
                
                // 4. Esconde os fundos dos cards (agora ocultos pela máscara branca)
                .to(".s4-card", { opacity: 0, duration: 0.1 }, "collapse+=1.6")

                // 5. Expande a máscara branca para cobrir a tela inteira (footer)
                .to("#white-rect", { 
                    width: "100vw", 
                    maxWidth: "100vw", 
                    height: "100vh", 
                    maxHeight: "100vh", 
                    minHeight: "100vh",
                    borderRadius: "0px", 
                    duration: 2.0, 
                    ease: "power3.inOut" 
                }, "expand")
                
                .to("#footer-wrapper", { autoAlpha: 1, duration: 0.1, pointerEvents: "auto" }, "expand+=1.4")
                .fromTo(".footer-logo", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.0, ease: "power2.out" }, "expand+=1.4")
                .fromTo(".footer-title", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.0, ease: "power2.out" }, "expand+=1.6")
                .fromTo(".footer-btns", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.0, ease: "power2.out" }, "expand+=1.6")
                .fromTo(".footer-legal", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.0, ease: "power2.out" }, "expand+=1.6")
                .to({}, { duration: 1.5 }); // Aumentado para 1.5s de buffer de scroll para evitar rubber-band shrink no desktop
        });

        // --- MOBILE (Cascata Vertical Centralizada e Sequencial) ---
        mm.add("(max-width: 767px)", () => {
            // Título simplificado no mobile: sem blur/GPU pesado para evitar crashes/reloads
            gsap.fromTo("#projects-title .char", 
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, stagger: 0.05, ease: "power2.out",
                  scrollTrigger: { trigger: "#section3", start: "top 85%", end: "top 55%", scrub: 1 }
                }
            );

            gsap.set(".s4-card, #white-rect", { xPercent: -50, yPercent: -50 });
            gsap.set("#card-01 .s4-text", { opacity: 1, y: 0 }); // Show Card 01 text immediately
            gsap.set("#card-02, #card-03, #card-04", { autoAlpha: 0 }); 
            
            gsap.set("#card-01", { zIndex: 40 });
            gsap.set("#card-02", { zIndex: 30 });
            gsap.set("#card-03", { zIndex: 20 });
            gsap.set("#card-04", { zIndex: 10 });

            const s4TlMobile = gsap.timeline({
                scrollTrigger: { trigger: "#section4", start: "top top", end: "+=350%", scrub: 1, pin: true }
            });

            s4TlMobile
            // Card 01 text is already visible from the start

            // S1: Começa a subir. Texto do Card-01 apaga (número continua visível!)
            .to("#card-01 .s4-text", { opacity: 0, duration: 0.3 }, "s1")
            .to("#card-01", { yPercent: -105, duration: 1.0, ease: "power2.inOut" }, "s1")
            .to("#card-02", { autoAlpha: 1, duration: 0.6, ease: "power2.inOut" }, "s1+=0.1") 
            .to("#card-02", { yPercent: 5, duration: 1.0, ease: "power2.inOut" }, "s1")
            // Quando S1 completa, texto do Card-02 surge
            .to("#card-02 .s4-text", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "s1+=1.0")

            // S2: Começa a subir. Texto do Card-02 apaga (número continua visível!)
            .to("#card-02 .s4-text", { opacity: 0, duration: 0.3 }, "s2")
            .to("#card-01", { yPercent: -215, duration: 1.0, ease: "power2.inOut" }, "s2")
            .to("#card-02", { yPercent: -105, duration: 1.0, ease: "power2.inOut" }, "s2")
            .to("#card-03", { autoAlpha: 1, duration: 0.6, ease: "power2.inOut" }, "s2+=0.1") 
            .to("#card-03", { yPercent: 5, duration: 1.0, ease: "power2.inOut" }, "s2")
            // Quando S2 completa, texto do Card-03 surge
            .to("#card-03 .s4-text", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "s2+=1.0")

            // S3: Começa a subir. Texto do Card-03 apaga (número continua visível!)
            .to("#card-03 .s4-text", { opacity: 0, duration: 0.3 }, "s3")
            .to("#card-01", { yPercent: -325, duration: 1.0, ease: "power2.inOut" }, "s3")
            .to("#card-02", { yPercent: -215, duration: 1.0, ease: "power2.inOut" }, "s3")
            .to("#card-03", { yPercent: -105, duration: 1.0, ease: "power2.inOut" }, "s3")
            .to("#card-04", { autoAlpha: 1, duration: 0.6, ease: "power2.inOut" }, "s3+=0.1") 
            .to("#card-04", { yPercent: 5, duration: 1.0, ease: "power2.inOut" }, "s3")
            // Quando S3 completa, texto do Card-04 surge
            .to("#card-04 .s4-text", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "s3+=1.0")

            // 1. Colapsa os cards primeiro no centro (todos vão para yPercent: -50, informações e números ainda visíveis)
            .to(".s4-card", { yPercent: -50, duration: 1.0, ease: "power2.inOut" }, "collapse")
            .to("#card-02, #card-03, #card-04", { autoAlpha: 0, duration: 0.5, ease: "power2.out" }, "collapse+=0.3")

            // 2. APÓS o colapso, apaga as informações e números
            .to([".s4-text", ".s4-num"], { opacity: 0, duration: 0.3, ease: "power2.in" }, "collapse+=1.0")
            
            // Dynamic size matching to start expanding #white-rect at the exact dimensions of a card on mobile
            .set("#white-rect", {
                width: () => {
                    const card = document.querySelector('#card-01');
                    return card ? card.getBoundingClientRect().width : "88vw";
                },
                height: () => {
                    const card = document.querySelector('#card-01');
                    return card ? card.getBoundingClientRect().height : "35vh";
                },
                borderRadius: "12px"
            }, "collapse+=1.0")

            // 3. Simultaneamente, mostra a máscara branca (#white-rect) no tamanho exato do card e esconde os fundos dos cards
            .to("#white-rect", { autoAlpha: 1, duration: 0.3 }, "collapse+=1.0")
            .to(".s4-card", { autoAlpha: 0, duration: 0.3 }, "collapse+=1.0")

            // 4. Expande a máscara branca para cobrir a tela inteira
            .to("#white-rect", { 
                width: "100vw", 
                maxWidth: "100vw", 
                height: "100vh", 
                maxHeight: "100vh", 
                minHeight: "100vh",
                borderRadius: "0px", 
                duration: 1.5, 
                ease: "power3.inOut" 
            }, "expand")

            .to("#footer-wrapper", { autoAlpha: 1, duration: 0.1, pointerEvents: "auto" }, "expand+=1.0")
            .fromTo(".footer-title", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "expand+=1.0")
            .fromTo(".footer-btns", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "expand+=1.1")
            .fromTo(".footer-logo", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "expand+=1.2")
            .fromTo(".footer-legal", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "expand+=1.2")
            .to({}, { duration: 1.5 }); // Aumentado para 1.5s de buffer de scroll para evitar rubber-band shrink no mobile
        });
    }
});
