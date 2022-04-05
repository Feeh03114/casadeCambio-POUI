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
  title= 'Fluxo de câmbio';
  categories: Array<string> = [];
  serie: Array<PoChartSerie> = [];
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
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  intervalLoandingAPI(){
    this.interval= setInterval(()=>this.LoadingAPI(), 1000 * 30);
  }

  LoadingAPI(){
    this.moedas.map((e)=>{
      this.http.get('https://economia.awesomeapi.com.br/last/'+e)
      .subscribe((data:any)=>{
        const index = this.itens.findIndex(x => x.moeda == data[e].code);
        if(index !== -1){
          this.itens[index].valueCompra = data[e].bid;
          this.itens[index].valueVenda = data[e].ask;
        
        }else{
          this.itens.push({
            moeda: data[e].code,
            valueCompra: data[e].bid,
            valueVenda: data[e].ask
          });
        }
        this.dates.push(data[e]);
      })
    })
    this.intervalLoandingAPI();
  }

}
