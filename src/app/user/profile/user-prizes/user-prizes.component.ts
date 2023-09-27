import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PrizeResponse, Prizes } from 'src/app/prizes/models/prizes';
import { UserPrizesService } from './api/user-prizes.service';
/**
 * UserPrizesComponent - Componente responsável pela exibição e gerenciamento dos prêmios do usuário.
 *
 * Propriedades:
 * - `redeemedPrizes`: Lista de prêmios resgatados pelo usuário.
 * - `createdPrizes`: Lista de prêmios criados pelo usuário (se for um parceiro).
 * - `dataGet`: Indicador booleano para determinar se os dados foram buscados.
 * - `qrCode`: Representa o QR code associado a um prêmio específico.
 * - `loader`: Indicador booleano para o estado de carregamento ao obter o QR code.
 * - `prize`: O ID do prêmio selecionado.
 * - `isPartner`: Indicador se o usuário é um parceiro.
 * - `index`: Índice do prêmio selecionado na lista.
 * - `noPrizes`: Indica se o usuário possui ou não prêmios.
 *
 * Métodos:
 * - `ngOnInit()`: Método inicial do ciclo de vida que faz a chamada API para buscar os prêmios.
 * - `getQrCode(prize: number)`: Busca o QR code para um prêmio específico.
 * - `cleanData()`: Limpa os dados selecionados e os estados associados.
 * - `desactivate()`: Desativa um prêmio criado pelo parceiro.
 * - `activate()`: Ativa um prêmio criado pelo parceiro.
 * - `getPrize(prize: number, index: number)`: Define o prêmio e o índice selecionados.
 *
 * Dependências:
 * - `apiRedeemedPrizes`: Serviço Angular que gerencia a comunicação entre o frontend e a API para informações relacionadas aos prêmios do usuário.
 *
 * Este componente é responsável por permitir que os usuários visualizem seus prêmios e, se forem parceiros, gerenciem os prêmios que criaram.
 * O componente verifica se o usuário é um parceiro (usando `localStorage`) e faz as chamadas API apropriadas com base nesse status.
 */
@Component({
  selector: 'app-user-prizes',
  templateUrl: './user-prizes.component.html',
  styleUrls: ['./user-prizes.component.css'],
})
export class UserPrizesComponent implements OnInit {
  public redeemedPrizes: PrizeResponse[];
  public createdPrizes: Prizes[];
  public dataGet: boolean = false;
  public qrCode: string;
  public loader: boolean = false;
  private prize: number;
  public noPrizes: boolean = true;

  private isPartner: boolean = false;

  private index: number;

  constructor(
    public apiRedeemedPrizes: UserPrizesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.apiRedeemedPrizes.loading = true;
    this.isPartner = localStorage.getItem('isPartner') === 'true';

    if (this.isPartner) {
      this.apiRedeemedPrizes.getCreatedPrizes().subscribe({
        next: (data: Prizes[]) => {
          if (data.length) {
            this.createdPrizes = data;
            this.noPrizes = false;
          }
          this.apiRedeemedPrizes.loading = false;
        },
        error: (e) => {
          this.apiRedeemedPrizes.loading = false;
        },
      });
    } else {
      this.apiRedeemedPrizes.getRedeemedPrizes().subscribe({
        next: (data: PrizeResponse[]) => {
          if (data.length) {
            this.noPrizes = false;
            this.redeemedPrizes = data;
          }
          this.apiRedeemedPrizes.loading = false;
        },
        error: (e) => {
          this.apiRedeemedPrizes.loading = false;
        },
      });
    }
  }

  getQrCode(prize: number): void {
    this.loader = true;
    this.apiRedeemedPrizes.getQrCode(prize).subscribe({
      next: (data) => {
        this.qrCode = data[0].qr_code;
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.loader = false;
      },
    });
  }

  cleanData(): void {
    this.qrCode = '';
    this.loader = false;
    this.prize = null;
    this.index = null;
  }

  desactivate(): void {
    this.apiRedeemedPrizes.loading = true;
    this.apiRedeemedPrizes.disablePrize(this.prize).subscribe({
      next: (data) => {
        this.createdPrizes[this.index] = data;
        this.ngOnInit();
      },
      error: (e) => console.log(e),
    });
  }

  activate(): void {
    this.apiRedeemedPrizes.loading = true;
    this.apiRedeemedPrizes.activatePrize(this.prize).subscribe({
      next: (data) => {
        this.createdPrizes[this.index] = data;
        this.ngOnInit();
      },
      error: (e) => console.log(e),
    });
  }

  getPrize(prize: number, index: number): void {
    this.prize = prize;
    this.index = index;
  }


}
