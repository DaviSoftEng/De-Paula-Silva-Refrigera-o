/* Partículas de neve */
(function () {
    var canvas = document.getElementById('ice-canvas');
    var ctx = canvas.getContext('2d');
    var particles = [];
    var COUNT = 60;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function randomParticle(fromBottom) {
        var roll = Math.random();
        var size = roll < 0.65
            ? Math.random() * 4 + 2      /* maioria: flocos suaves 2–6px */
            : Math.random() * 7 + 7;     /* minoria: cristais 7–14px */

        return {
            x: Math.random() * canvas.width,
            y: fromBottom
                ? canvas.height + Math.random() * 100
                : Math.random() * canvas.height,
            size: size,
            speedY: Math.random() * 0.5 + 0.25,
            opacity: Math.random() * 0.5 + 0.35,
            wave: Math.random() * Math.PI * 2,
            waveSpeed: Math.random() * 0.02 + 0.005,
            drift: (Math.random() - 0.5) * 0.3,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.008,
            isCrystal: roll >= 0.65,
        };
    }

    /* Floco suave: gradiente radial branco com borda transparente */
    function drawSoftFlake(p) {
        var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        g.addColorStop(0,   'rgba(255,255,255,' + p.opacity + ')');
        g.addColorStop(0.5, 'rgba(230,245,255,' + (p.opacity * 0.6) + ')');
        g.addColorStop(1,   'rgba(255,255,255,0)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
    }

    /* Cristal de neve: 6 braços, linhas finas brancas */
    function drawCrystal(p) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        var s = p.size;
        ctx.strokeStyle = 'rgba(255,255,255,' + p.opacity + ')';
        ctx.lineWidth = 1;
        ctx.shadowColor = 'rgba(200,230,255,' + (p.opacity * 0.5) + ')';
        ctx.shadowBlur = s * 0.8;

        for (var i = 0; i < 6; i++) {
            ctx.save();
            ctx.rotate((Math.PI / 3) * i);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -s);
            /* dois pares de galhos por braço */
            ctx.moveTo(0, -s * 0.38); ctx.lineTo( s * 0.2, -s * 0.55);
            ctx.moveTo(0, -s * 0.38); ctx.lineTo(-s * 0.2, -s * 0.55);
            ctx.moveTo(0, -s * 0.65); ctx.lineTo( s * 0.15, -s * 0.78);
            ctx.moveTo(0, -s * 0.65); ctx.lineTo(-s * 0.15, -s * 0.78);
            ctx.stroke();
            ctx.restore();
        }

        /* ponto central */
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.1, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,' + p.opacity + ')';
        ctx.fill();

        ctx.restore();
    }

    var blueSections = document.querySelectorAll('.hero, .ranking-section');

    function clipToBlueZones() {
        ctx.beginPath();
        blueSections.forEach(function (el) {
            var r = el.getBoundingClientRect();
            if (r.bottom > 0 && r.top < canvas.height) {
                ctx.rect(0, r.top, canvas.width, r.bottom - r.top);
            }
        });
        ctx.clip();
    }

    function init() {
        resize();
        particles = [];
        for (var i = 0; i < COUNT; i++) {
            particles.push(randomParticle(false));
        }
    }

    var lastTime = null;

    function tick(now) {
        if (!lastTime) lastTime = now;
        var dt = Math.min((now - lastTime) / 16.67, 3); /* normaliza pra 60fps */
        lastTime = now;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        clipToBlueZones();

        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];

            p.wave += p.waveSpeed * dt;
            p.x += (Math.sin(p.wave) * 0.5 + p.drift) * dt;
            p.y -= p.speedY * dt;
            p.rotation += p.rotSpeed * dt;

            if (p.y < -p.size * 2) {
                particles[i] = randomParticle(true);
                continue;
            }

            if (p.isCrystal) {
                drawCrystal(p);
            } else {
                drawSoftFlake(p);
            }
        }

        ctx.restore();
        requestAnimationFrame(tick);
    }

    window.addEventListener('resize', resize);
    init();
    requestAnimationFrame(tick);
})();

/* Agendamento WhatsApp */
function enviarAgendamento() {
    var nome = document.getElementById('nome').value.trim();
    var tel = document.getElementById('telefone').value.trim();
    var servico = document.getElementById('servico').value;
    var horario = document.getElementById('horario').value;
    var end = document.getElementById('endereco').value.trim();
    var obs = document.getElementById('obs').value.trim();

    if (!nome || !tel || !servico) {
        alert('Por favor, preencha pelo menos nome, telefone e tipo de serviço.');
        return;
    }

    var msg = 'Olá! Vim pelo site e gostaria de agendar um serviço.%0A%0A';
    msg += '*Nome:* ' + encodeURIComponent(nome) + '%0A';
    msg += '*Telefone:* ' + encodeURIComponent(tel) + '%0A';
    msg += '*Serviço:* ' + encodeURIComponent(servico) + '%0A';
    if (horario) msg += '*Horário preferido:* ' + encodeURIComponent(horario) + '%0A';
    if (end) msg += '*Endereço/Bairro:* ' + encodeURIComponent(end) + '%0A';
    if (obs) msg += '*Observações:* ' + encodeURIComponent(obs) + '%0A';

    document.getElementById('success').style.display = 'block';
    setTimeout(function () {
        window.open('https://wa.me/5521965004599?text=' + msg, '_blank');
    }, 800);
}
