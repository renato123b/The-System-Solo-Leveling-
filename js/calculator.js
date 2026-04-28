// js/calculator.js
const SystemLogic = {
    calculateStats(weight, height) {
        // Se a altura for maior que 3, assumimos que o usuário digitou em CM
        const h = height > 3 ? height / 100 : height;
        const bmi = weight / (h * h);
        
        let stats = { FOR: 10, AGI: 10, VIT: 10, INT: 12 };

        if (bmi > 30) { // Perfil Tanque
            stats.FOR += Math.floor(bmi / 1.5);
            stats.VIT += Math.floor(bmi / 2);
            stats.AGI -= 4;
        } else if (bmi > 25) { // Perfil Guerreiro
            stats.FOR += Math.floor(bmi / 2);
            stats.VIT += Math.floor(bmi / 2.5);
            stats.AGI += 2;
        } else { // Perfil Ágil
            stats.AGI += Math.floor(25 - bmi + 10);
            stats.FOR -= 2;
        }
        return stats;
    },

    getRank(weight, height) {
        const h = height > 3 ? height / 100 : height;
        const bmi = weight / (h * h);

        if (bmi > 30) return "RANK: D (TANKER)";
        if (bmi > 25) return "RANK: C (GUERREIRO)";
        return "RANK: E (ASSASSINO)";
    }
};