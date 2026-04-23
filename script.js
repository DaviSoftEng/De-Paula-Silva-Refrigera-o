/* Partículas de gelo */
(function () {
    var canvas = document.getElementById('ice-canvas');
    var ctx = canvas.getContext('2d');
    var particles = [];
    var COUNT = 45;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function randomParticle(fromBottom) {
        var type = Math.random();
        /* 50% flocos médios, 30% cristais grandes, 20% pontos pequenos */
        var size = type > 0.8
            ? Math.random() * 3 + 2          /* pequenos: 2–5px */
            : type > 0.3
                ? Math.random() * 5 + 5      /* médios: 5–10px */
                : Math.random() * 6 + 10;    /* cristais: 10–16px */

        return {
            x: Math.random() * canvas.width,
            y: fromBottom
                ? canvas.height + Math.random() * 150
                : Math.random() * canvas.height,
            size: size,
            speedY: (1 / size) * 18 + Math.random() * 0.6, /* maiores sobem mais devagar */
            opacity: Math.random() * 0.4 + 0.45,
            wave: Math.random() * Math.PI * 2,
            waveSpeed: Math.random() * 0.025 + 0.008,
            drift: (Math.random() - 0.5) * 0.4,
            rotation: Math.random() * Math.PI,
            rotSpeed: (Math.random() - 0.5) * 0.012,
        };
    }

    function drawCrystal(x, y, size, rotation, opacity) {
        var arms = 6;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.strokeStyle = 'rgba(180,225,255,' + opacity + ')';
        ctx.shadowColor = 'rgba(100,181,246,' + (opacity * 0.9) + ')';
        ctx.shadowBlur = size * 1.2;
        ctx.lineWidth = size > 10 ? 1.4 : 1;

        for (var a = 0; a < arms; a++) {
            ctx.save();
            ctx.rotate((Math.PI / arms) * a);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -size);
            /* galhos laterais */
            ctx.moveTo(0, -size * 0.35);
            ctx.lineTo(size * 0.22, -size * 0.55);
            ctx.moveTo(0, -size * 0.35);
            ctx.lineTo(-size * 0.22, -size * 0.55);
            ctx.moveTo(0, -size * 0.6);
            ctx.lineTo(size * 0.18, -size * 0.75);
            ctx.moveTo(0, -size * 0.6);
            ctx.lineTo(-size * 0.18, -size * 0.75);
            ctx.stroke();
            ctx.restore();
        }

        /* núcleo */
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.12, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(220,240,255,' + opacity + ')';
        ctx.fill();

        ctx.restore();
    }

    function drawFlake(x, y, size, opacity) {
        ctx.save();
        ctx.shadowColor = 'rgba(100,181,246,' + opacity + ')';
        ctx.shadowBlur = size * 1.8;
        ctx.beginPath();
        ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(210,235,255,' + opacity + ')';
        ctx.fill();
        ctx.restore();
    }

    function init() {
        resize();
        particles = [];
        for (var i = 0; i < COUNT; i++) {
            particles.push(randomParticle(false));
        }
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

    function tick() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        clipToBlueZones();

        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];

            p.wave += p.waveSpeed;
            p.x += Math.sin(p.wave) * 0.6 + p.drift;
            p.y -= p.speedY;
            p.rotation += p.rotSpeed;

            if (p.y < -p.size * 2) {
                particles[i] = randomParticle(true);
                continue;
            }

            if (p.size >= 10) {
                drawCrystal(p.x, p.y, p.size, p.rotation, p.opacity);
            } else {
                drawFlake(p.x, p.y, p.size, p.opacity);
            }
        }

        ctx.restore();
        requestAnimationFrame(tick);
    }

    window.addEventListener('resize', resize);

    init();
    tick();
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
