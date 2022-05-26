import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PoTableColumn } from '@po-ui/ng-components';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  moedas = ['USD', 'CAD', 'EUR', 'GBP', 'JPY', 'ARS', 'CNY', 'BTC', 'BOB', 'CHF'];
  interval:any; 
  dates:any[] = [];
  
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

  constructor(readonly http: HttpClient){}

  ngOnInit(): void {
    this.LoadingAPI()
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  intervalLoandingAPI(){
    this.interval= setInterval(()=>{this.LoadingAPI();}, 1000 * 30);
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

}
