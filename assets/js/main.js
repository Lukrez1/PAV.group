document.addEventListener("DOMContentLoaded", () => {

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
        
        // Finalização assíncrona do Preloader (Estático na Hero)
        const finishLoading = () => {
            if (window.__preloaderFinished) return;
            window.__preloaderFinished = true;
            
            // Limpa o temporizador da simulação vanilla
            if (window.__preloaderInterval) {
                clearInterval(window.__preloaderInterval);
            }
            
            const counterVal = { val: window.__preloaderCount || 0 };
            const preloaderTl = gsap.timeline({
                onComplete: () => {
                    const preloader = document.getElementById('preloader');
                    if (preloader) preloader.style.display = 'none';
                    lenis.start();
                    ScrollTrigger.refresh(); 
                }
            });

            if (!prefersReducedMotion) {
                preloaderTl.to(counterVal, {
                    val: 100, 
                    duration: 0.4, 
                    ease: "power2.out",
                    onUpdate: () => {
                        const counterEl = document.getElementById("preloader-counter");
                        if (counterEl) counterEl.innerText = Math.round(counterVal.val) + "%";
                    }
                })
                .to("#preloader-counter", { opacity: 0, y: -10, duration: 0.2, ease: "power1.in" })
                .to("#preloader-logo", { scale: 30, opacity: 0, duration: 0.8, ease: "power4.inOut" }, "-=0.1")
                .to("#preloader", { opacity: 0, duration: 0.5, ease: "power2.inOut" }, "-=0.5");
            } else {
                preloaderTl.to("#preloader", { opacity: 0, duration: 0.3 });
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

        gsap.fromTo("#projects-title .char", 
            { opacity: 0, filter: "blur(16px)" },
            { opacity: 1, filter: "blur(0px)", stagger: 0.1, ease: "none",
              scrollTrigger: { trigger: "#section3", start: "top 80%", end: "top 30%", scrub: 1 }
            }
        );

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
            const s4States = { c1: false, c2: false, c3: false, out: false };
            
            const onUpdateS4 = function(self) {
                let p = self.progress; 
                const inOutSpeed = 0.4;
                if (p > 0.05 && !s4States.c1) { gsap.to("#card-01 .s4-text", { opacity: 1, y: 0, duration: inOutSpeed, overwrite: true }); s4States.c1 = true; } 
                else if (p <= 0.05 && s4States.c1) { gsap.to("#card-01 .s4-text", { opacity: 0, y: 15, duration: 0.3, overwrite: true }); s4States.c1 = false; }
                
                if (p > 0.20 && !s4States.c2) { gsap.to("#card-02 .s4-text", { opacity: 1, y: 0, duration: inOutSpeed, overwrite: true }); s4States.c2 = true; } 
                else if (p <= 0.20 && s4States.c2) { gsap.to("#card-02 .s4-text", { opacity: 0, y: 15, duration: 0.3, overwrite: true }); s4States.c2 = false; }
                
                if (p > 0.38 && !s4States.c3) { gsap.to("#card-03 .s4-text, #card-04 .s4-text", { opacity: 1, y: 0, duration: inOutSpeed, overwrite: true }); s4States.c3 = true; } 
                else if (p <= 0.38 && s4States.c3) { gsap.to("#card-03 .s4-text, #card-04 .s4-text", { opacity: 0, y: 15, duration: 0.3, overwrite: true }); s4States.c3 = false; }
                
                if (p > 0.60 && !s4States.out) { gsap.to(".s4-text", { opacity: 0, y: -10, duration: 0.3, overwrite: true }); s4States.out = true; } 
                else if (p <= 0.60 && s4States.out) {
                    if (s4States.c1) gsap.to("#card-01 .s4-text", { opacity: 1, y: 0, duration: 0.3, overwrite: true });
                    if (s4States.c2) gsap.to("#card-02 .s4-text", { opacity: 1, y: 0, duration: 0.3, overwrite: true });
                    if (s4States.c3) gsap.to("#card-03 .s4-text, #card-04 .s4-text", { opacity: 1, y: 0, duration: 0.3, overwrite: true });
                    s4States.out = false;
                }
            };

            const s4Tl = gsap.timeline({
                scrollTrigger: { trigger: "#section4", start: "top top", end: "+=500%", scrub: 1, pin: true, onUpdate: onUpdateS4 }
            });

            gsap.set(".s4-card, #white-rect", { xPercent: -50, yPercent: -50 });
            gsap.set("#card-02, #card-03, #card-04", { autoAlpha: 0 });
            const gap = 3; 

            s4Tl.to({}, { duration: 1.0 }) 
                .to("#card-02", { autoAlpha: 1, duration: 0.1 }, "split") 
                .to("#card-01", { xPercent: gap, yPercent: -100 - gap, duration: 1.2, ease: "power2.inOut" }, "split")
                .to("#card-02", { xPercent: -100 - gap, yPercent: gap, duration: 1.2, ease: "power2.inOut" }, "split")
                .to({}, { duration: 0.5 }) 
                .fromTo("#card-03", { autoAlpha: 0, xPercent: -100 - gap, yPercent: 100 + gap }, { autoAlpha: 1, xPercent: -100 - gap, yPercent: -100 - gap, duration: 1.2, ease: "power2.inOut" }, "grid")
                .fromTo("#card-04", { autoAlpha: 0, xPercent: gap, yPercent: -100 - gap }, { autoAlpha: 1, xPercent: gap, yPercent: gap, duration: 1.2, ease: "power2.inOut" }, "grid")
                .to({}, { duration: 2.0 }) 
                .to(".s4-card", { xPercent: -50, yPercent: -50, duration: 1.2, ease: "power2.inOut" })
                .to(".s4-card", { opacity: 0, duration: 0.1 })
                .to("#white-rect", { opacity: 1, duration: 0.1 }, "<")
                .to("#white-rect", { width: "100vw", maxWidth: "100vw", height: "100vh", borderRadius: "0px", duration: 2.0, ease: "power3.inOut" }, "expand")
                .to("#footer-wrapper", { autoAlpha: 1, duration: 0.1, pointerEvents: "auto" }, "expand+=1.4")
                .fromTo(".footer-logo", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.0, ease: "power2.out" }, "expand+=1.4")
                .fromTo(".footer-title", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.0, ease: "power2.out" }, "expand+=1.6")
                .fromTo(".footer-btns", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.0, ease: "power2.out" }, "expand+=1.6")
                .fromTo(".footer-legal", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.0, ease: "power2.out" }, "expand+=1.6")
                .to({}, { duration: 0.5 }); 
        });

        // --- MOBILE (Cascata Vertical Centralizada) ---
        mm.add("(max-width: 767px)", () => {
            gsap.set(".s4-card, #white-rect", { xPercent: -50, yPercent: -50 });
            gsap.set("#card-02, #card-03, #card-04", { autoAlpha: 0 }); 
            
            gsap.set("#card-01", { zIndex: 40 });
            gsap.set("#card-02", { zIndex: 30 });
            gsap.set("#card-03", { zIndex: 20 });
            gsap.set("#card-04", { zIndex: 10 });

            const s4TlMobile = gsap.timeline({
                scrollTrigger: { trigger: "#section4", start: "top top", end: "+=600%", scrub: 1, pin: true }
            });

            s4TlMobile.to({}, { duration: 0.5 }) 

            .to("#card-01", { yPercent: -102, duration: 1.2, ease: "power2.inOut" }, "s1")
            .to("#card-02", { autoAlpha: 1, duration: 0.8, ease: "power2.inOut" }, "s1+=0.2") 
            .to("#card-02", { yPercent: 2, duration: 1.2, ease: "power2.inOut" }, "s1")

            .to({}, { duration: 0.3 }) 

            .to("#card-01", { yPercent: -154, duration: 1.2, ease: "power2.inOut" }, "s2")
            .to("#card-02", { yPercent: -50, duration: 1.2, ease: "power2.inOut" }, "s2")
            .to("#card-03", { autoAlpha: 1, duration: 0.8, ease: "power2.inOut" }, "s2+=0.2") 
            .to("#card-03", { yPercent: 54, duration: 1.2, ease: "power2.inOut" }, "s2")

            .to({}, { duration: 0.3 }) 

            .to("#card-01", { yPercent: -206, duration: 1.2, ease: "power2.inOut" }, "s3")
            .to("#card-02", { yPercent: -102, duration: 1.2, ease: "power2.inOut" }, "s3")
            .to("#card-03", { yPercent: 2, duration: 1.2, ease: "power2.inOut" }, "s3")
            .to("#card-04", { autoAlpha: 1, duration: 0.8, ease: "power2.inOut" }, "s3+=0.2") 
            .to("#card-04", { yPercent: 106, duration: 1.2, ease: "power2.inOut" }, "s3")

            .to({}, { duration: 1.2 }) 

            .to(".s4-card", { yPercent: -50, duration: 1.2, ease: "power2.inOut" }, "collapse")
            .to("#card-02, #card-03, #card-04", { autoAlpha: 0, duration: 0.6, ease: "power2.out" }, "collapse+=0.4")

            .to("#white-rect", { autoAlpha: 1, duration: 0.1 }, "expandStart")
            .to("#card-01", { autoAlpha: 0, duration: 0.4 }, "expandStart")
            .to("#white-rect", { width: "100vw", maxWidth: "100vw", height: "100vh", maxHeight: "100vh", borderRadius: "0px", duration: 1.5, ease: "power3.inOut" }, "expandStart+=0.1")

            .to("#footer-wrapper", { autoAlpha: 1, duration: 0.1, pointerEvents: "auto" }, "expandStart+=1.0")
            .fromTo(".footer-title", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "expandStart+=1.0")
            .fromTo(".footer-btns", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "expandStart+=1.1")
            .fromTo(".footer-logo", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "expandStart+=1.2")
            .fromTo(".footer-legal", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "expandStart+=1.2")
            .to({}, { duration: 0.5 });
        });
    }
});
