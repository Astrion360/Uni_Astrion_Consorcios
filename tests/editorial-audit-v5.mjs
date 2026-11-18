import {readFileSync} from 'node:fs';
import {Script,createContext} from 'node:vm';
import assert from 'node:assert/strict';
const read=p=>readFileSync(p,'utf8');
const js=read('curriculum/editorial-v5.js');
const css=read('curriculum/editorial-v5.css');
const html=read('index.html');
const c=createContext({window:{}});
new Script(js,{filename:'curriculum/editorial-v5.js'}).runInContext(c);
const edi=c.window.UNI_EDITORIAL_V5;
assert.ok(edi,'Edição visual não foi inicializada');
assert.equal(edi.scenarios.length,10,'A oficina deve reunir dez casos');
assert.ok(edi.scenarios.every(x=>x.method.length===3 && x.question.length>45 && x.reason.length>85),'Caso sem profundidade suficiente');
assert.equal(new Set(edi.scenarios.map(x=>x.id)).size,10);
const data={modules:Array.from({length:50},(_,i)=>({
  id:'m'+String(i+1).padStart(2,'0'),track:'fundamentos',title:'Unidade '+(i+1),
  lessons:Array.from({length:4},(_,j)=>({title:'Aula '+(j+1),body:'# Princípios\n• Consorciado: participa do grupo.\n# Exercício guiado\nEX: Investigue as condições do contrato.'}))
}))};
const upgraded=edi.enhance(data);
assert.equal(upgraded.modules.length,50);
assert.ok(upgraded.editorialCrossLinks>=15,'Casos não foram relacionados às aulas');
assert.equal(upgraded.editorialEdition,'2026-11-v5');
assert.ok(upgraded.modules.find(x=>x.id==='m16').lessons.every(x=>x.body.includes('Oficina comercial')),'Oficina não integrada ao módulo comercial');
const sample=edi.chapterVisual(upgraded.modules[0],0,upgraded.modules[0].lessons[0]);
assert.ok(sample.includes('ed-path-art') && sample.includes('<svg') && sample.includes('ed-three'),'Infográfico visual ausente');
for(const module of upgraded.modules)for(let i=0;i<4;i++)assert.ok(edi.chapterVisual(module,i,module.lessons[i]).includes('ed-lesson-opening'),'Aula sem representação visual');
const page=edi.objectionsPage();
assert.equal((page.match(/<details class="ed-case">/g)||[]).length,10);
assert.ok(page.includes('Lei nº 11.795/2008')&&page.includes('Banco Central'));
assert.ok(css.includes('@media(max-width:580px)'),'Sem versão móvel');
assert.ok(html.includes('curriculum/editorial-v5.css')&&html.includes('curriculum/editorial-v5.js'),'Arquivos não carregados');
assert.ok(html.includes('UNI_EDITORIAL_V5.enhance(window.UNI_ACADEMY_V4.enhance(data))'),'Enriquecimento não ativado');
const beg='<script id="unia-course-engine" type="application/json">';
const a=html.indexOf(beg),b=html.indexOf('</script>',a);
assert.ok(a>=0&&b>a,'Motor original não encontrado');
const engine=JSON.parse(html.slice(a+beg.length,b));
new Script(engine,{filename:'academic-engine.js'});
assert.ok(engine.includes("view==='objections'?"),'Oficina ausente da navegação');
assert.ok(engine.includes("chapterVisual(m,i,l)"),'Todos os módulos devem receber os infográficos');
assert.ok(engine.includes("moduleDone(m)===m.lessons.length"),'Avaliações não podem ser liberadas antes da última aula');
for(const [name,src] of [['HTML',html],['editorial',js],['CSS',css]]){
 assert.ok(!/wiz(?:\\b|[-\s])|wiz\\s*parceiros/i.test(src),'Marca de terceiros identificada em '+name);
}
console.log('UniAstrion editorial v5 OK: 10 casos originais, 50 módulos, 200 infográficos, módulos vinculados e navegação consistente.');