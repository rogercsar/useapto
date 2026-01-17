const CATEGORY_KEYWORDS = {
    'finance': ['contabilidade', 'fiscal', 'tributário', 'dre', 'fluxo de caixa', 'conciliação', 'balanço', 'auditoria', 'tax', 'ifrs', 'cpc', 'excel', 'vba', 'sap', 'contas a pagar', 'contas a receber', 'bancário', 'tesouraria', 'financeiro'],
    'admin': ['rotinas administrativas', 'compras', 'estoque', 'facilities', 'arquivo', 'recepção', 'secretariado', 'viagens', 'pagamentos', 'fornecedores', 'organização', 'atendimento', 'agenda', 'pacote office', 'redação', 'email', 'telefone', 'documentos', 'planilhas', 'suporte administrativo'],
    'legal': ['direito', 'oab', 'contratos', 'civil', 'trabalhista', 'contencioso', 'petição', 'jurídico', 'legal', 'compliance', 'lgpd', 'audiência', 'processual', 'societário', 'advogado'],
    'tech': ['javascript', 'typescript', 'react', 'node', 'python', 'sql', 'aws', 'docker', 'git', 'agile', 'scrum', 'api', 'devops', 'postgres', 'mongodb', 'mysql', 'frontend', 'backend', 'fullstack', 'mobile', 'cloud', 'segurança', 'arquitetura', 'programador', 'desenvolvedor', 'software', 'engenhara de computação', 'ciência da computação', 'sistemas de informação'],
    'sales': ['prospecção', 'vendas', 'negociação', 'crm', 'funil', 'cold call', 'b2b', 'b2c', 'metas', 'pós-venda', 'cliente', 'apresentação', 'comercial', 'varejo', 'vendedor', 'pdv', 'venda externa', 'atendimento ao cliente'],
    'hr': ['recrutamento e seleção', 'departamento pessoal', 'benefícios', 'admissão e demissão', 'treinamento e desenvolvimento', 'cultura organizacional', 'onboarding', 'folha de pagamento', 'recursos humanos', 'gestão de pessoas', 'clima organizacional', 'remuneração']
};

const SENIORITY_LEVELS = {
    'junior': ['junior', 'jr', 'trainee', 'estagiário', 'aprendiz', 'assistente', 'auxiliar'],
    'pleno': ['pleno', 'pl', 'intermediário', 'analista ii', 'nível ii'],
    'senior': ['senior', 'sr', 'sênior', 'especialista', 'analista iii', 'nível iii', 'arquitetura', 'liderança'],
    'gestao': ['gerente', 'coordenador', 'diretor', 'gestor', 'head', 'lead', 'lider', 'líder', 'supervisor', 'cto', 'ceo']
};

export const analyzeCandidate = async (candidate, jobDescription) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const cvTextLower = (candidate.cvText || "").toLowerCase();
            const jobDescLower = jobDescription.toLowerCase();

            // 1. Identify Job Category
            let detectedCategory = 'general';
            let maxCategoryMatches = 0;

            for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
                const matchCount = keywords.filter(k => {
                    const regex = new RegExp(`\\b${k}\\b`, 'i');
                    return regex.test(jobDescLower);
                }).length;

                // Tech weight boost to avoid false positives from HR/Admin benefits section
                const weightedCount = category === 'tech' ? matchCount * 1.5 : matchCount;

                if (weightedCount > maxCategoryMatches) {
                    maxCategoryMatches = weightedCount;
                    detectedCategory = category;
                }
            }

            // 2. Detect Candidate Seniority
            let detectedSeniority = 'junior';
            let maxSeniorityMatches = 0;

            for (const [level, keywords] of Object.entries(SENIORITY_LEVELS)) {
                const matchCount = keywords.filter(k => cvTextLower.includes(k)).length;
                // Add weighting based on experience keywords found in CV
                if (matchCount > maxSeniorityMatches) {
                    maxSeniorityMatches = matchCount;
                    detectedSeniority = level;
                }
            }

            // If no clear seniority found but CV is long/complex, boost to Pleno/Senior
            if (maxSeniorityMatches === 0) {
                if (cvTextLower.length > 2000) detectedSeniority = 'senior';
                else if (cvTextLower.length > 1000) detectedSeniority = 'pleno';
            }

            // 3. Compare with applied job
            const appliedTitleLower = (candidate.job || "").toLowerCase();
            let appliedLevel = 'junior';
            for (const [level, keywords] of Object.entries(SENIORITY_LEVELS)) {
                if (keywords.some(k => appliedTitleLower.includes(k))) {
                    appliedLevel = level;
                }
            }

            // 4. Role Suggestion Logic
            const currentJob = candidate.job || "Candidato";
            let suggestedRole = currentJob;
            const levelMap = { 'junior': 1, 'pleno': 2, 'senior': 3, 'gestao': 4 };

            if (levelMap[detectedSeniority] !== levelMap[appliedLevel]) {
                const baseRole = currentJob.replace(/(junior|jr|pleno|pl|senior|sr|especialista|gerente|coordenador)/i, "").trim() || "Profissional";
                const levelLabels = { 'junior': 'Junior', 'pleno': 'Pleno', 'senior': 'Senior', 'gestao': 'Gestor' };
                suggestedRole = `${baseRole} ${levelLabels[detectedSeniority]}`;
            }

            // 5. Extract Keywords and Score
            const baseKeywords = CATEGORY_KEYWORDS[detectedCategory] || [];
            const jobKeywords = baseKeywords.filter(k => jobDescLower.includes(k));
            const extraKeywords = jobDescLower.match(/\b[a-zA-ZÀ-ÿ]{5,}\b/g) || [];
            const meaningfulExtras = extraKeywords.filter(k =>
                !['para', 'com', 'que', 'uma', 'como', 'mais', 'pelo', 'ser'].includes(k) &&
                cvTextLower.includes(k)
            ).slice(0, 5);

            const allTargetKeywords = [...new Set([...jobKeywords, ...meaningfulExtras])];
            const strengths = [];
            const gaps = [];
            let weightedScore = 0;
            const weightPerMatch = 100 / (allTargetKeywords.length || 1);

            allTargetKeywords.forEach(keyword => {
                if (cvTextLower.includes(keyword)) {
                    strengths.push(keyword);
                    weightedScore += baseKeywords.includes(keyword) ? weightPerMatch * 1.2 : weightPerMatch;
                } else {
                    gaps.push(keyword);
                }
            });

            let finalScore = Math.min(Math.round(weightedScore), 100);

            // 6. Detect Candidate Area from CV (Background)
            let detectedBackground = 'general';
            let maxBgMatches = 0;
            for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
                const matchCount = keywords.filter(k => {
                    const regex = new RegExp(`\\b${k}\\b`, 'i');
                    return regex.test(cvTextLower);
                }).length;
                if (matchCount > maxBgMatches) {
                    maxBgMatches = matchCount;
                    detectedBackground = category;
                }
            }

            // 7. Generate Observations & Recommendations
            const categoryLabels = {
                'finance': 'Finanças',
                'admin': 'Administração',
                'legal': 'Jurídico',
                'tech': 'Tecnologia',
                'sales': 'Comercial/Vendas',
                'hr': 'Recursos Humanos',
                'general': 'Geral'
            };

            const displayCategory = categoryLabels[detectedBackground] || categoryLabels['general'];

            let observation = "";
            if (detectedBackground === detectedCategory || (detectedCategory === 'tech' && detectedBackground === 'tech')) {
                observation = `O perfil do candidato demonstra experiência sólida e alinhada com a área de ${displayCategory}. Seu nível de maturidade profissional como nível ${detectedSeniority} e competências técnicas são compatíveis com o cargo de ${suggestedRole}.`;
            } else {
                observation = `O perfil do currículo do candidato demonstra um histórico maior em ${displayCategory}, entretanto, suas competências atuais e nível de senioridade como ${detectedSeniority} indicam que ele pode se adaptar bem à função de ${suggestedRole}.`;
            }

            observation += ` ${detectedSeniority === 'senior' || detectedSeniority === 'gestao' ? 'Apresenta forte perfil de liderança e autonomia.' : 'Demonstra excelente potencial de crescimento técnico na área.'}`;

            const recommendations = [
                `Focar no desenvolvimento de: ${gaps.slice(0, 3).join(', ') || 'novas competências da área'}.`,
                `O candidato possui o perfil para atuar como ${detectedSeniority}.`,
                `Validar experiências passadas com foco em ${strengths.slice(0, 2).join(' e ') || 'competências chaves'}.`
            ];

            resolve({
                ...candidate,
                score: `${finalScore}%`,
                strengths: strengths.slice(0, 8),
                gaps: gaps.slice(0, 5),
                seniority: detectedSeniority,
                suggestedRole: suggestedRole,
                observation: observation,
                recommendations: recommendations,
                analyzedAt: new Date().toISOString()
            });
        }, 1500);
    });
};

