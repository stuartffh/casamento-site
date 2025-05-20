const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { protectNonGetRoutes } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Obter conteúdo de uma seção específica (público)
router.get('/:section', async (req, res) => {
  try {
    const { section } = req.params;
    
    let content = await prisma.content.findUnique({
      where: { section }
    });
    
    if (!content) {
      // Criar conteúdo padrão se não existir
      const defaultContent = getDefaultContent(section);
      
      content = await prisma.content.create({
        data: {
          section,
          content: defaultContent
        }
      });
    }
    
    res.json(content);
  } catch (error) {
    console.error('Erro ao buscar conteúdo:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Atualizar conteúdo de uma seção (protegido)
router.put('/:section', protectNonGetRoutes, async (req, res) => {
  try {
    const { section } = req.params;
    const { content: contentText } = req.body;
    
    let content = await prisma.content.findUnique({
      where: { section }
    });
    
    if (content) {
      content = await prisma.content.update({
        where: { section },
        data: { content: contentText }
      });
    } else {
      content = await prisma.content.create({
        data: {
          section,
          content: contentText
        }
      });
    }
    
    res.json(content);
  } catch (error) {
    console.error('Erro ao atualizar conteúdo:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Função auxiliar para obter conteúdo padrão
function getDefaultContent(section) {
  const defaultContents = {
    home: 'Estamos muito felizes em ter você aqui!',
    historia: 'Era uma vez… uma amizade que virou encontro, um encontro que virou história, e uma história que virou vida.\n\nMarília e Iago se conheceram ainda no colégio Núcleo/Cursinho, em 2013, graças ao empurrãozinho de um grande amigo em comum, Jorge (obrigado por isso, Jorge!). Entre risadas e encontros nos corredores, uma amizade foi se formando — até que, no dia 12 de setembro de 2015, tudo mudou: com um beijo surpresa na boate Seu Regueira, o que era leve começou a ficar sério.\n\nPoucos dias depois, no dia 18 de setembro, saíram com amigos e começaram a conversar sobre o dia seguinte. Marília comentou que iria para o aniversário da tia, e Iago pediu para ir junto. Brincando, disse que queria ser apresentado como "irmão" — e foi nesse momento que o coração dela teve certeza: era ele. No dia seguinte, 19 de setembro de 2015, começaram oficialmente a namorar.\n\nDez anos depois — sim, 10 anos depois! — aqui estão eles, dizendo "sim" um ao outro no altar, exatamente um dia após a data que marcou o início dessa jornada.',
    informacoes: '📍 Cerimônia:\nConcatedral de São Pedro dos Clérigos – às 19h\nAv. Dantas Barreto, 677 – São José\n(Dica: teremos manobrista nesse ponto)\n\n📍 Recepção:\nEspaço Dom – R. das Oficinas, 15 – Pina (dentro da Ecomariner)\n⚠ Importante: no Waze, digite "Ecomariner" (não "Espaço Dom")\nDica: Passando o túnel do RioMar, cruza a Antônio de Gois, primeira direita e depois primeira esquerda.\n\n👗 Dress Code:\nFormal – porque esse dia merece um look à altura!\n\n🏨 Hospedagem Sugerida:\nHotel Luzeiros Recife\nIbis Boa Viagem\n\n🚖 Transporte:\nParceria com TeleTáxi na saída da igreja!'
  };
  
  return defaultContents[section] || '';
}

module.exports = router;
