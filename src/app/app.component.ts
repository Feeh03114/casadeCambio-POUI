import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PoChartOptions, PoChartSerie, PoChartType, PoTableColumn } from '@po-ui/ng-components';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  moedas = ['USD', 'CAD', 'EUR', 'GBP', 'JPY', 'ARS', 'CNY', 'BTC', 'BOB', 'CHF'];
  interval:any; 
  dates:any[] = [];

  moedasSelect:any[]= [
    {label: 'USD', value: 'USD'}, 
    {label: 'CAD', value: 'CAD'}, 
    {label: 'EUR', value: 'EUR'}, 
    {label: 'GBP', value: 'GBP'}, 
    {label: 'JPY', value: 'JPY'}, 
    {label: 'ARS', value: 'ARS'}, 
    {label: 'CNY', value: 'CNY'}, 
    {label: 'BTC', value: 'BTC'}, 
    {label: 'BOB', value: 'BOB'}, 
    {label: 'CHF', value: 'CHF'}
  ];
  
  //table
  columns: Array<PoTableColumn>= [
    { 
      property: 'moeda', 
      label:'Moeda', 
    },
    { 
      property: 'valueCompra', 
      label:'Valor de Compra', 
      type:'currency'
    },
    { 
      property: 'valueVenda', 
      label:'Valor de Venda', 
      type:'currency',
    }
  ];
  tebela:string = 'Relação de moedas';
  itens: any[] = [];

  //fluxo
  ExportsType: PoChartType = PoChartType.Line;
  title = 'Fluxo de câmbio';
  categories: Array<string> = [];
  serie: Array<PoChartSerie> = [];

  title2 = 'Fluxo de câmbio';
  categories2: Array<string> = [];
  serie2: Array<PoChartSerie> = [];
  options: PoChartOptions = {
    axis: {
      minRange: 0,
      maxRange: 40,
      gridLines: 5,
    },
  };

  constructor(readonly http: HttpClient){}

  ngOnInit(): void {
    this.LoadingAPI()
    this.LoadingAPIHistory()
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  intervalLoandingAPI(){
    this.interval= setInterval(()=>{this.LoadingAPI(); this.LoadingAPIHistory();}, 1000 * 30);
  }

  LoadingAPI(){
    this.tebela = 'Tabela de Cotações - ' + new Date().toLocaleString();
    this.moedas.map((e)=>{
      this.http.get('https://economia.awesomeapi.com.br/last/'+e)
      .subscribe((data:any)=>{
        const respData = data[Object.keys(data)[0]]
        const index = this.itens.findIndex(x => x.moeda == respData.code);
        if(index !== -1){
          if(e === 'BTC'){
            this.itens[index].valueCompra = respData.bid.replace('.','');
            this.itens[index].valueVenda = respData.ask.replace('.','');
          }else{
            this.itens[index].valueCompra = respData.bid;
            this.itens[index].valueVenda = respData.ask;
          }
        }else{
          if(e === 'BTC'){
            this.itens.push({
              moeda: respData.code,
              valueCompra: respData.bid.replace('.',''),
              valueVenda: respData.ask.replace('.','')
            });
          }else{
            this.itens.push({
              moeda: respData.code,
              valueCompra: respData.bid,
              valueVenda: respData.ask
            });
          }
        }
        this.dates.push(respData);
      })
    })
    this.intervalLoandingAPI();
  }


  LoadingAPIHistory(){
    this.title = 'Fluxo de câmbio Compra - ' + new Date().toLocaleDateString();
    this.title2 = 'Fluxo de câmbio Venda - ' + new Date().toLocaleDateString();
    const result: { label: string; data: any[]; }[] = [];
    const cate: string[] = [];
    this.moedas.filter(x=>x !== 'BTC').map((e)=>{
      this.http.get(`https://economia.awesomeapi.com.br/json/daily/${e}/7`)
      .subscribe((data:any)=>{
        data.map((res:any)=>{
          const index = cate.findIndex(x => x === new Date(res.timestamp*1000).toLocaleDateString());
          if(index === -1){
            cate.push(new Date(res.timestamp*1000).toLocaleDateString());
          }

          if(res?.code){
            const indexSerieCompra = result.findIndex(x => x.label === res.code + ' Compra');
            if(indexSerieCompra === -1){
              if(e !== 'BTC'){
                result.push({
                  label: res.code + ' Compra',
                  data: [res.bid]
                })
              }else{
                result.push({
                  label: res.code + ' Compra',
                  data: [res.bid.replace('.','')]
                })
              }
            }else if(indexSerieCompra !== -1){
              if(e !== 'BTC'){
                result[indexSerieCompra].data.push(res.bid);
              }else{
                result[indexSerieCompra].data.push(res.bid.replace('.',''));
              }
            }

            const indexSerieVenda = this.serie.findIndex(x => x.label === res?.code + ' Venda');
            if(indexSerieVenda === -1){
              if(e !== 'BTC'){
                result.push({
                  label: res.code + ' Venda',
                  data: [res.bid]
                })
              }else{
                result.push({
                  label: res.code + ' Venda',
                  data: [res.bid.replace('.','')]
                })
              }
            }else if(indexSerieVenda !== -1){
              if(e !== 'BTC'){
                result[indexSerieVenda].data.push(res.ask);
              }else{
                result[indexSerieVenda].data.push(res.ask.replace('.',''));
              }
            }
          }else{
            if(e !== 'BTC'){
              const indexSerieCompra2 = result.findIndex(x => x.label === e + ' Compra');
              if(indexSerieCompra2 !== -1){
                result[indexSerieCompra2].data.push(res.bid);
              }

              const indexSerieVenda2 = this.serie.findIndex(x => x.label === e + ' Venda');
              if(indexSerieVenda2 !== -1){
                result[indexSerieVenda2].data.push(res.ask);
              }
            }else{
              const indexSerieCompra2 = result.findIndex(x => x.label === e + ' Compra');
              if(indexSerieCompra2 !== -1){
                result[indexSerieCompra2].data.push(res.bid.replace('.',''));
              }

              const indexSerieVenda2 = this.serie.findIndex(x => x.label === e + ' Venda');
              if(indexSerieVenda2 !== -1){
                result[indexSerieVenda2].data.push(res.ask.replace('.',''));
              }
            }
          }

        })
        const indexRespCompra = this.serie.findIndex(x => x.label === e + ' Compra');
        if(indexRespCompra === -1){
          this.serie = result.filter(x => x.label.includes('Compra')).map((x)=>{return{ label:x.label.replace('Compra',''), data: x.data}});
        }else{
          this.serie[indexRespCompra].data = result.filter(x => x.label.includes('Compra')).map((x)=>{return{ label:x.label.replace('Compra',''), data: x.data}})[0].data;
        }
        
        const indexRespVenda = this.serie.findIndex(x => x.label === e + ' Venda');
        if(indexRespVenda === -1){
          this.serie2 = result.filter(x => x.label.includes('Venda')).map((x)=>{return{ label:x.label.replace('Venda',''), data: x.data}});
        }else{
          this.serie2[indexRespVenda].data = result.filter(x => x.label.includes('Venda')).map((x)=>{return{ label:x.label.replace('Venda',''), data: x.data}})[0].data;
        }
        
        this.categories = cate;
        console.log(this.serie)
      })
    })
    //this.intervalLoandingAPI();
  }

}
