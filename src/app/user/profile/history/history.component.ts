import { Component, OnInit } from '@angular/core';
import { HistoryService } from './api/history.service';
import { UserHistory } from 'src/app/home/models/history';
/**
 * HistoryComponent - Componente Angular responsável por exibir o histórico do usuário.
 *
 * Propriedades:
 * - `history`: Um array de objetos `UserHistory` que representa o histórico do usuário.
 *
 * Métodos:
 * - `ngOnInit()`: Inicializa e busca o histórico do usuário através do serviço `HistoryService`.
 *
 * Dependências:
 * - `apiHistory`: Serviço que facilita a comunicação com a API do histórico do usuário. Ele é usado para obter os dados do histórico do usuário.
 *
 * O componente `HistoryComponent` é responsável por recuperar e exibir o histórico do usuário. Ele se comunica com a API através do serviço
 * `HistoryService`
 * para obter o histórico. Uma vez obtido, o histórico é armazenado na propriedade `history` e é exibido na respectiva view do componente. Além disso,
 * o histórico é invertido para que os eventos mais recentes sejam exibidos primeiro.
 *
 * O componente é definido pelo seletor 'app-history', possuindo seu próprio template HTML e arquivo de estilo CSS.
 */
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent implements OnInit {
  public history: UserHistory[];

  constructor(public apiHistory: HistoryService) {}

  ngOnInit(): void {
    this.apiHistory.loading = true;
    this.apiHistory.getUserHistory().subscribe({
      next: (data: UserHistory[]) => {
        this.history = data.slice(0).reverse();
        this.apiHistory.loading = false;
      },
    });
  }
}
