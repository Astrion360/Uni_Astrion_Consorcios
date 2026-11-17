import { readFileSync } from 'node:fs';
import { Script, createContext } from 'node:vm';
import assert from 'node:assert/strict';

const read = path => readFileSync(path, 'utf8');
const fake = {
  modules: Array.from({ length:50 }, (_,i)=>{
    const id='m'+String(i+1).padStart(2,'0');
    return {id,track:['fundamentos','decisoes','gestao','profissional','setores','especialista'][i%6],
      title:'Módulo '+id,desc:'Descrição do módulo',
      lessons:Array.from({length:4},(_,j)=>({
        title:'Aula '+(j+1),
        body:i===0&&j===0
          ?'# Três perguntas que revelam se você compreendeu\nDe onde sai o dinheiro que compra os bens? Do grupo. Quem determina a contemplação? O regulamento. O que muda na contemplação? O direito de utilizar o crédito.'
          : '# Conceito fundamental\n• Consorciado: participante com direitos e obrigações.\nUma conclusão profissional exige base documental.'
      })),questions:[]};
  }),
  tracks:[],glossary:[],faq:[],sources:[]
};
const context = createContext({window:{}});
for (const x of ['a','b','c']) {
  new Script(read('curriculum/masters-'+x+'-v4.js'), {filename:x}).runInContext(context);
}
new Script(read('curriculum/review-v4.js'), {filename:'review-v4.js'}).runInContext(context);
const enhanced=context.window.UNI_ACADEMY_V4.enhance(fake);
assert.equal(enhanced.academicEdition,'2026-11-rev4');
assert.equal(enhanced.modules.length,50);
assert.equal(enhanced.modules.reduce((n,m)=>n+m.lessons.length,0),200);
assert.equal(enhanced.modules.reduce((n,m)=>n+m.questions.length,0),150);
assert.equal(enhanced.academicCoverage.originalCharacters<enhanced.academicCoverage.revisedCharacters,true);
assert.ok(enhanced.modules[42].lessons[0].body.includes('Quatro marcos com consequências diferentes'));
assert.ok(enhanced.modules[0].lessons[0].body.includes('Aplicação profissional'));
assert.ok(enhanced.modules[0].lessons[0].body.includes('**'));
assert.ok(enhanced.sources.length>=6);
for(const module of enhanced.modules) {
  assert.equal(module.lessons.length,4,module.id);
  assert.equal(module.questions.length,3,module.id);
  for(const q of module.questions) {
    assert.equal(typeof q.q,'string');
    assert.ok(q.q.length>=50,module.id+' enunciado');
    assert.ok(q.why.length>=45,module.id+' fundamentação');
    assert.equal(q.options.length,4,module.id);
    assert.equal(new Set(q.options).size,4,module.id+' alternativas repetidas');
    assert.ok(Number.isInteger(q.correct)&&q.correct>=0&&q.correct<4,module.id+' gabarito');
  }
}
const html=read('index.html');
for(const file of ['masters-a-v4.js','masters-b-v4.js','masters-c-v4.js','review-v4.js'])assert.ok(html.includes(file),'Falta include '+file);
const openTag='<script id="unia-course-engine" type="application/json">';
const begin=html.indexOf(openTag);
const finish=html.indexOf('</script>',begin);
assert.ok(begin>=0&&finish>begin,'Motor do curso ausente');
const engine=JSON.parse(html.slice(begin+openTag.length,finish));
new Script(engine,{filename:'academic-engine.js'});
assert.ok(engine.includes("moduleDone(m)===m.lessons.length"),'Teste de módulo sem bloqueio');
assert.ok(engine.includes('qa-stack'),'Perguntas e respostas sem formatação');
assert.ok(html.includes('UNI_ACADEMY_V4.enhance(data)'),'Conteúdo revisado não conectado');
assert.ok(engine.includes('Prova final bloqueada'),'Falta bloqueio visual da prova final');
console.log('UniAstrion OK — 50 módulos, 200 aulas revisadas, 150 questões formativas; JavaScript e bloqueios válidos.');
