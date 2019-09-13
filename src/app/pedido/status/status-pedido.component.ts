import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RxStompService} from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';

import { PedidosService } from 'src/app/services/pedidos.service';
import { AvaliacoesService } from 'src/app/services/avaliacoes.service';

@Component({
  selector: 'app-status-pedido',
  templateUrl: './status-pedido.component.html'
})
export class StatusPedidoComponent implements OnInit {

  pedido: any = {};
  avaliacao: any = {};

  constructor(private route: ActivatedRoute,
              private rxStompService: RxStompService,
              private router: Router,
              private pedidoService: PedidosService,
              private avaliacoesService: AvaliacoesService) {
  }

  ngOnInit() {
    const pedidoId = this.route.snapshot.params.pedidoId;
    this.pedidoService.porId(pedidoId)
      .subscribe(pedido => this.pedido = pedido);

    this.rxStompService.watch(`/pedidos/${pedidoId}/status`)
      .subscribe((message: Message) => {
        const pedido = JSON.parse(message.body);
        this.pedido.status = pedido.status;
      });


  }

  salvaAvaliacao() {
    this.avaliacao.pedido = this.pedido;
    this.avaliacoesService.salva(this.avaliacao)
      .subscribe(avaliacao => {
        this.avaliacao = avaliacao;
        setTimeout(() => this.router.navigate(['']), 1500);
      });
  }
}
