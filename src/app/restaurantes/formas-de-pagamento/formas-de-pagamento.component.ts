import { Component, OnInit, Input } from '@angular/core';

import { FormaDePagamentoService } from 'src/app/services/forma-de-pagamento.service';

@Component({
  selector: 'app-formas-de-pagamento',
  templateUrl: './formas-de-pagamento.component.html'
})
export class FormasDePagamentoComponent implements OnInit {

  @Input() restaurante: any;
  todasAsFormasDePagamento: Array<any> = [];
  idsFormasDePagamentoDoRestaurante: Array<any>;
  formaDePagamentoParaAdicionar: any = null;

  constructor(private formaDePagamentoService: FormaDePagamentoService) {
  }

  ngOnInit() {
    this.formaDePagamentoService.todas()
      .subscribe(todasAsFormas => this.todasAsFormasDePagamento = todasAsFormas);

    this.formaDePagamentoService.doRestaurante(this.restaurante)
      .subscribe((idsFormasDePagamento: any) => {
        this.idsFormasDePagamentoDoRestaurante = idsFormasDePagamento;
        this.idsFormasDePagamentoDoRestaurante
            .sort((a, b) => this.nomeFormaDePagamento(a).localeCompare(this.nomeFormaDePagamento(b)));
      });
  }

  adicionaFormaDePagamentoAoRestaurante() {
    if (this.formaDePagamentoParaAdicionar) {
      const idFormaDePagamentoParaAdicionar = this.formaDePagamentoParaAdicionar.id;
      const jaTem = this.idsFormasDePagamentoDoRestaurante.some(id => id === idFormaDePagamentoParaAdicionar);
      if (!jaTem) {
        this.formaDePagamentoService.adicionaAoRestaurante(idFormaDePagamentoParaAdicionar, this.restaurante)
          .subscribe(() => {
              this.idsFormasDePagamentoDoRestaurante.push(idFormaDePagamentoParaAdicionar);
              this.idsFormasDePagamentoDoRestaurante
                  .sort((a, b) => this.nomeFormaDePagamento(a).localeCompare(this.nomeFormaDePagamento(b)));
              this.formaDePagamentoParaAdicionar = null;
          });
      }
    }
  }

  remove(idFormaDePagamento) {
    this.formaDePagamentoService.removeDoRestaurante(idFormaDePagamento, this.restaurante)
      .subscribe(() => {
        this.idsFormasDePagamentoDoRestaurante = this.idsFormasDePagamentoDoRestaurante.filter(f => f !== idFormaDePagamento);
      });
  }

  nomeFormaDePagamento(idFormaDePagamento) {
    const forma = this.todasAsFormasDePagamento.find(formaDePagamento => formaDePagamento.id === idFormaDePagamento);
    return forma ? forma.nome : '';
  }
}
