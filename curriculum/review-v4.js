/* UniAstrion · Edição acadêmica v4 · Novembro/2026.
 * Reestruturação preserva o curso criptografado original e as 200 aulas.
 * Estudos de caso e avaliações formativas são carregados após autenticação. */
(function(){
  'use strict';
  const normativa={
    lei:'Lei nº 11.795/2008',
    grupos:'Resolução BCB nº 285/2023 (consultar alterações e redação vigente)',
    adm:'Resolução BCB nº 234/2022 (consultar alterações e redação vigente)'
  };
  const refs=[
    ['Lei nº 11.795/2008','https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2008/lei/l11795.htm','Marco legal do sistema de consórcios.'],
    ['Resolução BCB nº 285/2023','https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?numero=285&tipo=Resolu%C3%A7%C3%A3o%20BCB','Constituição e funcionamento de grupos; verificar atualizações.'],
    ['Resolução BCB nº 234/2022','https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?numero=234&tipo=Resolu%C3%A7%C3%A3o%20BCB','Constituição e funcionamento de administradoras; verificar atualizações.'],
    ['Perguntas e respostas do BCB sobre consórcios','https://www.bcb.gov.br/meubc/faqs/s/consorcio','Orientações ao consumidor e aspectos operacionais; verificar data e versão.'],
    ['Informações oficiais sobre utilização do FGTS','https://www.caixa.gov.br/beneficios-trabalhador/fgts/Paginas/default.aspx','Consultar as regras específicas vigentes para a finalidade pretendida.'],
    ['Informações públicas de seguros — SUSEP','https://www.gov.br/susep/pt-br','Consultar coberturas, produtos e regras de seguros em vigor.']
  ];
  const firstMaturity={
    fundamentos:'Identifique no contrato a regra correspondente ao conceito. Compare a definição com a situação do cliente e registre o efeito financeiro e a incerteza temporal.',
    decisoes:'Confronte o evento informado com a ata ou confirmação oficial da administradora. Liste pré-condições para pagamento, efeitos no saldo e documentação de cada marco.',
    gestao:'Faça uma linha do tempo da cota, classifique estado de pagamento e contemplação, distinga obrigação do titular e risco coletivo e documente as medidas admissíveis.',
    profissional:'Registre diagnóstico, hipótese, simulação, proposta, ressalvas, consentimentos e aprovação nas respectivas competências. A recomendação deve ser revisável por outro profissional.',
    setores:'Valide enquadramento da categoria, características do bem ou serviço, fornecedor, garantias, documentos, momento de aquisição e compatibilidade com o orçamento.',
    especialista:'Teste cálculos, exposição econômica, riscos, controles e premissas. Separe evidência histórica de previsão e identifique quem pode tomar cada decisão.'
  };
  const caseQuestion=[
    'Qual é o fato decisivo que precisa ser confirmado antes de orientar o consorciado?',
    'Quais condições de utilização do crédito ainda precisam ser verificadas?',
    'Que evidências e documentos sustentam a decisão no caso apresentado?',
    'Como explicar a recomendação, os riscos e as limitações sem criar promessa indevida?'
  ];
  function ensureColonBold(s){
    return s.replace(/(^|\n)(•\s+)?(Consorciado|Grupo|Administradora|Parceiro comercial|Fornecedor|Fundo comum|Fundo de reserva|Taxa de administração|Seguro prestamista|Lance embutido|Contemplação|Cota aprovada|Crédito liberado|Quitação)(\s*:)/g, (all,start,bullet,term,col)=>start+(bullet||'')+'**'+term+':**');
  }
  function technicalTerminology(){
    return [
      '# Quatro marcos com consequências diferentes',
      '• **Adesão ou contratação da cota:** a administradora confirma a contratação nas condições do grupo. Não significa contemplação, disponibilização imediata de crédito nem quitação. A expressão comercial “cota aprovada” deve ser substituída por indicação verificável do ato efetivamente confirmado.',
      '• **Contemplação:** ocorre conforme as regras de sorteio ou lance e a disponibilidade de recursos. Atribui direito de utilizar o crédito, sujeito às condições previstas e à comprovação dos requisitos aplicáveis.',
      '• **Habilitação e liberação do crédito:** compreendem verificação documental, capacidade de pagamento, garantias quando exigidas, validação do bem ou serviço e procedimento de pagamento. A liberação não decorre automaticamente da contemplação.',
      '• **Quitação:** exige cumprimento integral das obrigações contratuais, com confirmação do saldo e providências de baixa das garantias cabíveis. Comprar o bem não significa extinguir a dívida.',
      '# Caso documentado — comunicação com precisão',
      'EX: Um cliente apresenta mensagem de “cota aprovada” e pede pagamento ao fornecedor. O profissional deve perguntar qual evento foi formalmente confirmado, exigir o documento de respaldo e informar as condições ainda pendentes. Se apenas a adesão ocorreu, não se pode anunciar contemplação; se houve contemplação, não se pode anunciar crédito liberado sem a conclusão da esteira.',
      '✓ **Registro mínimo:** data do evento, origem da informação, documento oficial, valores, situação de pagamento, pendências, responsável pela próxima etapa e expectativa comunicada ao cliente.'
    ].join('\n');
  }
  function rotateQuestion(options,correct,seed){
    const shift=((seed%4)+4)%4;
    const arranged=Array(4);
    for(let i=0;i<4;i++)arranged[(i+shift)%4]=options[i];
    return {options:arranged,correct:(correct+shift)%4};
  }
  function deepen(data){
    if(!data||!Array.isArray(data.modules)||data.modules.length!==50){
      throw new Error('Plano acadêmico inconsistente: 50 módulos são esperados.');
    }
    const blocks=Object.assign({},...(Object.values(window.UNI_MASTERY_PARTS||{})));
    if(Object.keys(blocks).length!==50)throw new Error('Revisão acadêmica incompleta: confira os módulos do plano.');
    let updated=0,totalQuestions=0,oldLen=0,newLen=0;
    data.modules.forEach((m,mi)=>{
      const b=blocks[m.id];
      if(!b||!Array.isArray(b.lessons)||b.lessons.length!==4||!Array.isArray(b.questions)||b.questions.length!==3)
        throw new Error('Revisão ausente para '+m.id);
      m.lessons.forEach((lesson,i)=>{
        const original=lesson.body;
        oldLen+=original.length;
        let body=original;
        if(m.id==='m43'&&i===0){
          body=body.split('\n').filter(line=>!line.includes('“Ter a cota aprovada”')&&!line.includes('"Ter a cota aprovada"')).join('\n');
          body+='\n'+technicalTerminology();
        }
        body=ensureColonBold(body);
        const field=b.lessons[i];
        body += [
          '',
          '# Aplicação profissional · Estudo de caso',
          'EX: '+b.case,
          '# Análise técnica orientada',
          field,
          '# Raciocínio para a tomada de decisão',
          '**Pergunta de aplicação:** '+caseQuestion[i],
          '**Critério de resposta:** a conclusão precisa distinguir o que a documentação comprova, o que depende das regras específicas do grupo, os riscos para as partes e as providências necessárias antes de agir.',
          '# Evidências e verificação',
          '• **Documento e responsável:** identifique o registro oficial ou contratual que confirma a condição tratada nesta aula e quem possui competência para deliberar.',
          '• **Efeito econômico:** mostre, quando relevante, o impacto no crédito disponível, prestação, saldo, prazo, garantia ou fluxo de caixa; diferencie cálculo demonstrativo de valor contratual.',
          '• **Limite da conclusão:** quando faltarem dados, descreva qual informação precisa ser obtida antes de recomendar, prometer ou executar a operação.',
          '✓ **Base de referência:** '+(m.track==='especialista'?normativa.lei+'; '+normativa.grupos+'; '+normativa.adm:m.track==='fundamentos'?normativa.lei+' e '+normativa.grupos:'verifique a regra contratual, a '+normativa.lei+' e a norma setorial vigente')+'.'
        ].join('\n');
        // Differentiate theory (what the text says) from case (how it is used).
        lesson.body=body;
        newLen+=body.length;
        updated++;
      });
      m.questions=b.questions.map((row,i)=>{
        const [q,options,correct,why]=row;
        if(typeof q!=='string'||q.length<50||options.length!==4||why.length<45||!Number.isInteger(correct)||correct<0||correct>3)
          throw new Error('Questão incompleta: '+m.id+' / '+(i+1));
        const shifted=rotateQuestion(options,correct,mi*5+i*3+1);
        return {q,options:shifted.options,correct:shifted.correct,why};
      });
      totalQuestions+=m.questions.length;
    });
    if(updated!==200||totalQuestions!==150)throw new Error('Revisão não abrange o curso completo.');
    const sources=data.sources||[];
    const existing=new Set(sources.map(x=>x[1]));
    for(const item of refs){if(!existing.has(item[1])){sources.push(item);existing.add(item[1]);}}
    data.sources=sources;
    data.academicEdition='2026-11-rev4';
    data.academicCoverage={modules:50,lessons:200,moduleQuestions:150,originalCharacters:oldLen,revisedCharacters:newLen};
    return data;
  }
  window.UNI_ACADEMY_V4={enhance:deepen,edition:'2026-11-rev4'};
})();