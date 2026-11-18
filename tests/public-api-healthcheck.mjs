import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const origin = 'https://uni.astrion360.com.br';
const url = 'https://tyakaqlnmfigtyeqmffy.supabase.co/functions/v1/uni-public';
const requestHeaders = ['authorization','apikey','content-type','x-client-info','x-supabase-api-version','x-supabase-client-platform','x-supabase-client-platform-version','x-supabase-client-runtime','x-supabase-client-runtime-version'];
const opts = await fetch(url,{
  method:'OPTIONS',headers:{'Origin':origin,'Access-Control-Request-Method':'POST','Access-Control-Request-Headers':requestHeaders.join(',')}
});
const allowed = opts.headers.get('Access-Control-Allow-Headers')?.toLowerCase().split(',').map(x=>x.trim())||[];
assert.equal(opts.status,204,'Falha em preflight: HTTP '+opts.status);
assert.equal(opts.headers.get('Access-Control-Allow-Origin'),origin,'Origem CORS não permitida');
for(const h of requestHeaders) assert.ok(allowed.includes(h),'Cabeçalho bloqueado pelo CORS: '+h);
assert.ok((opts.headers.get('Access-Control-Allow-Methods')||'').toUpperCase().includes('POST'));
console.log('Preflight CORS: OK ('+allowed.length+' cabeçalhos, HTTPS e origem permitida)');

const html=readFileSync('index.html','utf8');
const match=html.match(/const PUBLISHABLE_KEY = '([^']+)'/);
assert.ok(match,'Chave pública não encontrada no HTML');
const key=match[1];
const response=await fetch(url,{
 method:'POST',
 headers:{
  'Origin':origin,
  'Content-Type':'application/json',
  'apikey':key,
  'Authorization':'Bearer '+key,
  'x-client-info':'uni-astrion-e2e',
  'x-supabase-api-version':'2024-01-01',
  'x-supabase-client-platform':'web',
 },
 body:JSON.stringify({action:'verify-cert',code:'UA-26-000000000000'})
});
const raw=await response.text();
assert.equal(response.status,200,'POST público falhou: HTTP '+response.status+' '+raw.slice(0,200));
assert.equal(response.headers.get('Access-Control-Allow-Origin'),origin,'Origem CORS ausente no POST');
const data=JSON.parse(raw);
assert.equal(data.valid,false,'Código fictício não deve validar certificado real');
console.log('POST autenticado por chave publicável: OK. Endpoint de matrícula acessível sem criar registros.');
const invalidApplication=await fetch(url,{
  method:'POST',
  headers:{
    'Origin':origin,
    'Content-Type':'application/json',
    'apikey':key,
    'Authorization':'Bearer '+key,
    'x-client-info':'uni-astrion-e2e'
  },
  body:JSON.stringify({action:'apply',full_name:'Teste Técnico',email:'nao-e-um-email',privacy_accepted:false})
});
const invalidBody=await invalidApplication.json();
assert.equal(invalidApplication.status,400,'Validação de matrícula inválida deve rejeitar sem cadastrar');
assert.ok(invalidBody.error?.includes('e-mail'),'Retorno da validação de matrícula inesperado');
assert.equal(invalidApplication.headers.get('Access-Control-Allow-Origin'),origin);
console.log('Rota de matrícula: OK, dados inválidos rejeitados sem inserir candidatos.');
