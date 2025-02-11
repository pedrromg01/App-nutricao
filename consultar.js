// Mapear os valores do local para normalizar
const mapearLocal = {
    todaPlanta: 'Toda planta',
    folhasJovens: 'Folhas Jovens',
    folhasVelhas: 'Folhas Velhas',
    raizes: 'Raízes',
};

// Carregar o CSV e filtrar os dados com base nos critérios do usuário
async function carregarCSV() {
    const csvPath = './nutricaoflorestalsintomas.csv';
    try {
        const response = await fetch(csvPath);
        if (!response.ok) {
            throw new Error('Erro ao carregar o arquivo CSV');
        }
        const csvData = await response.text();
        return csvParaObjeto(csvData);
    } catch (error) {
        console.error('Erro ao carregar CSV:', error);
        alert('Não foi possível carregar o arquivo de dados.');
        return [];
    }
}

// Converter o conteúdo CSV em um array de objetos
function csvParaObjeto(csv) {
    const linhas = csv.split('\n');
    const headers = linhas[0].split(',').map(header => header.trim());
    return linhas.slice(1).filter(linha => linha.trim() !== '').map(linha => {
        const valores = linha.split(',');
        return headers.reduce((obj, header, index) => {
            obj[header] = valores[index]?.trim();
            return obj;
        }, {});
    });
}

// Filtrar os dados com base nos sintomas e no local
function filtrarDados(dados, sintomasSelecionados, localSelecionado) {
    const localCorrespondente = mapearLocal[localSelecionado] || '';

    return dados.filter(item => {
        // Verifica se pelo menos um dos sintomas selecionados está presente
        const contemSintomas = sintomasSelecionados.some(sintoma =>
            item['sintomas']?.toLowerCase().includes(sintoma.toLowerCase())
        );
        // Verifica o local de ocorrência
        const localCoincide =
            item['local_de_ocorrencia']?.trim() === localCorrespondente || localSelecionado === 'todaPlanta';

        return contemSintomas && localCoincide;
    });
}

// Formatar lista para adicionar vírgulas corretamente
function formatarLista(texto) {
    const itens = texto.split(/(?=[A-Z])/).map(item => item.trim()); // Divide onde começa uma letra maiúscula
    return itens
        .map((item, index) => {
            if (index === itens.length - 1) {
                return `<span>${item}</span>`; // Não adiciona vírgula no último item
            }
            return `<span>${item},</span>`;
        })
        .join(' ');
}

function exibirResultados(resultados) {
    const container = document.getElementById('resultado-consulta');
    container.innerHTML = '';

    if (resultados.length === 0) {
        container.innerHTML = '<p>Nenhum resultado encontrado.</p>';
        return;
    }

    // Adicionar o aviso estilizado
    const aviso = document.createElement('div');
    aviso.innerHTML = `
        <p style="
            font-size: 1.2rem;
            font-weight: bold;
            text-align: center;
            color: #006400; /* Verde escuro */
        ">
            Aviso: Com base nos sintomas que você selecionou, segue uma lista dos nutrientes que podem estar em déficit.
        </p>
    `;
    container.appendChild(aviso);

    resultados.forEach(resultado => {
        const card = document.createElement('div');
        card.classList.add('resultado');

        // Caminho dinâmico da imagem baseado no nome do nutriente
        const nomeDoNutriente = resultado['chave'].toLowerCase();
        const caminhoImagem = `./doencas/doenca_${nomeDoNutriente}.jpg`;

        card.innerHTML = `
            <div style="
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                background-color: #f9f9f9;
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 16px;
                margin-bottom: 16px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            ">
                <!-- Informações do lado esquerdo -->
                <div style="flex: 1; margin-right: 16px;">
                    <h3 style="font-weight: bold; font-size: 1.5rem; margin-bottom: 0.5rem; color: #333;">
                        ${resultado['nutriente']}
                    </h3>

                    <p><strong>Tipo:</strong> <span style="font-weight: normal; color: #555;">${resultado['tipo']}</span></p>
                    <p><strong>Função:</strong></p>
                    <p style="padding-left: 1.5rem; margin-bottom: 1rem; color: #555;">
                        ${formatarLista(resultado['funcao_na_planta'])}
                    </p>
                    <p><strong>Mobilidade no Solo:</strong> <span style="font-weight: normal; color: #555;">${resultado['mobilidade_solo']}</span></p>
                    <p style="margin-left: 1rem; font-style: italic; color: #777;">(${resultado['mobilidade_solo_comentario']})</p>
                    <p><strong>Mobilidade na Planta:</strong> <span style="font-weight: normal; color: #555;">${resultado['mobilidade_planta']}</span></p>
                    <p style="margin-left: 1rem; font-style: italic; color: #777;">(${resultado['mobilidade_planta_comentario']})</p>
                    <p><strong>Correção da Deficiência:</strong> <span style="font-weight: normal; color: #555;">${resultado['correcao_da_deficiencia']}</span></p>
                    <p><strong>Fontes Naturais:</strong> <span style="font-weight: normal; color: #555;">${resultado['fontes_naturais']}</span></p>
                    <p><strong>Interações com Outros Nutrientes:</strong> <span style="font-weight: normal; color: #555;">${resultado['interacoes_com_outros_nutrientes']}</span></p>
                    <p><strong>Faixa Ótima no Solo:</strong> <span style="font-weight: normal; color: #555;">${resultado['faixa_otima_solo']}</span></p>
                    <p><strong>Faixa Ótima na Folha:</strong> <span style="font-weight: normal; color: #555;">${resultado['faixa_otima_folha']}</span></p>
                    <p><strong>Método de Diagnóstico:</strong> <span style="font-weight: normal; color: #555;">${resultado['indicadores_no_solo_planta']}</span></p>
                    <p><strong>Faixa de pH Ideal no Solo:</strong> <span style="font-weight: normal; color: #555;">${resultado['faixa_de_ph_ideal_no_solo']}</span></p>
                    <p><strong>Tipo de Solo Ideal:</strong> <span style="font-weight: normal; color: #555;">${resultado['tipo_de_solo_ideal']}</span></p>
                    <p><strong>Aplicação no Solo:</strong> <span style="font-weight: normal; color: #555;">${resultado['aplicacao_no_solo']}</span></p>
                    <p><strong>Fertirrigação:</strong> <span style="font-weight: normal; color: #555;">${resultado['fertirrigacao']}</span></p>
                    <p><strong>Aplicação Foliar:</strong> <span style="font-weight: normal; color: #555;">${resultado['aplicacao_foliar']}</span></p>
                </div>

                <!-- Imagem do lado direito -->
                <div class="image-container" style="flex: 0 0 200px; text-align: center;">
                    <img src="${caminhoImagem}" alt="Imagem relacionada a deficiência de ${resultado['nutriente']}" class="zoomable-image" onerror="this.src='./doencas/default.jpg';">
                    <p style="font-size: 0.75rem; color: #666; margin-top: 8px;">
                        <em>Boletim Embrapa - Macro e Micro Nutrientes<br>Autor: Oscar Fontão de Lima Filho<br>Autor: Paulo Luiz Lanzetta Aguiar</em>
                    </p>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}



// Lógica principal ao clicar no botão "Consultar"
document.getElementById('consultar-sintomas-btn').addEventListener('click', async () => {
    const checkboxes = document.querySelectorAll('.sintomas-container input[type="checkbox"]:checked');
    const sintomasSelecionados = Array.from(checkboxes).map(checkbox => checkbox.value);

    const localSelecionado = document.getElementById('localOcorrencia').value;

    if (sintomasSelecionados.length === 0) {
        alert('Por favor, selecione pelo menos um sintoma.');
        return;
    }

    const dados = await carregarCSV();
    console.log('Dados carregados:', dados);

    const resultadosFiltrados = filtrarDados(dados, sintomasSelecionados, localSelecionado);
    console.log('Resultados filtrados:', resultadosFiltrados);

    exibirResultados(resultadosFiltrados);
});
