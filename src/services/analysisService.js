const CATEGORY_KEYWORDS = {
    'finance': ['contabilidade', 'fiscal', 'tributário', 'dre', 'fluxo de caixa', 'conciliação', 'balanço', 'auditoria', 'tax', 'ifrs', 'cpc', 'excel', 'vba', 'sap', 'contas a pagar', 'contas a receber', 'bancário', 'investimentos', 'tesouraria'],
    'admin': ['rotinas administrativas', 'compras', 'estoque', 'facilities', 'arquivo', 'recepção', 'secretariado', 'viagens', 'pagamentos', 'fornecedores', 'organização', 'atendimento', 'agenda', 'pacote office', 'redação', 'email', 'telefone', 'documentos', 'planilhas', 'gestão de materiais'],
    'legal': ['direito', 'oab', 'contratos', 'civil', 'trabalhista', 'contencioso', 'petição', 'jurídico', 'legal', 'compliance', 'lgpd', 'audiência', 'processual', 'societário', 'marcas e patentes'],
    'tech': ['javascript', 'react', 'node', 'python', 'sql', 'aws', 'docker', 'git', 'agile', 'scrum', 'api', 'devops', 'banco de dados'],
    'sales': ['prospecção', 'vendas', 'negociação', 'crm', 'funil', 'cold call', 'b2b', 'b2c', 'metas', 'pós-venda', 'cliente', 'apresentação'],
    'hr': ['recrutamento', 'seleção', 'dp', 'departamento pessoal', 'benefícios', 'admissão', 'treinamento', 'cultura', 'onboarding', 'folha de pagamento']
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
                const matchCount = keywords.filter(k => jobDescLower.includes(k)).length;
                if (matchCount > maxCategoryMatches) {
                    maxCategoryMatches = matchCount;
                    detectedCategory = category;
                }
            }

            // 2. Extract Keywords from Job Description
            // Use category-specific keywords if detected, plus general extraction
            const baseKeywords = CATEGORY_KEYWORDS[detectedCategory] || [];
            const jobKeywords = baseKeywords.filter(k => jobDescLower.includes(k));

            // Add other potential keywords found in description (simple length filter for now)
            const extraKeywords = jobDescLower.match(/\b[a-zA-ZÀ-ÿ]{5,}\b/g) || [];
            const meaningfulExtras = extraKeywords.filter(k =>
                !['para', 'com', 'que', 'uma', 'como', 'mais', 'pelo', 'ser'].includes(k) &&
                cvTextLower.includes(k)
            ).slice(0, 5); // Limit extras

            const allTargetKeywords = [...new Set([...jobKeywords, ...meaningfulExtras])];

            // 3. Find Matches and Gaps
            const strengths = [];
            const gaps = [];
            let weightedScore = 0;
            const weightPerMatch = 100 / (allTargetKeywords.length || 1);

            allTargetKeywords.forEach(keyword => {
                if (cvTextLower.includes(keyword)) {
                    strengths.push(keyword);
                    // Critical skills (from category list) weigh more
                    if (baseKeywords.includes(keyword)) {
                        weightedScore += weightPerMatch * 1.2;
                    } else {
                        weightedScore += weightPerMatch;
                    }
                } else {
                    gaps.push(keyword);
                }
            });

            // Cap score at 100
            let finalScore = Math.min(Math.round(weightedScore), 100);

            // Boost logic for text length (retained from previous fix but refined)
            if (cvTextLower.length > 50 && finalScore < 10 && strengths.length > 0) {
                finalScore = 15; // Minimum score for decent CV with at least some match
            }

            // Handle case with no specific keywords found but text present
            if (allTargetKeywords.length === 0 && cvTextLower.length > 100) {
                finalScore = 10; // Baseline for just having a CV
            }

            resolve({
                ...candidate,
                score: `${finalScore}%`,
                strengths: strengths.slice(0, 5), // Top 5
                gaps: gaps.slice(0, 5), // Top 5
                analyzedAt: new Date().toISOString()
            });
        }, 1500);
    });
};
