import { Component, OnInit } from '@angular/core';
import { PrizesService } from './api/prizes.service';
import { Prizes } from './models/prizes';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CreatePrizeService } from './create/api/create-prize.service';
/**
 * PrizesComponent - Componente que gerencia a visualização e resgate de prêmios.
 *
 * Propriedades:
 * - `prizes`: Uma lista de prêmios disponíveis.
 * - `categorys`: Uma lista de categorias de prêmios disponíveis.
 * - `loader`: Flag que indica se um carregamento está em andamento.
 * - `prizeId`, `prizeName`, `prizeCost`: Propriedades relacionadas ao prêmio que o usuário está prestes a resgatar.
 * - `success`, `e402`, `e400`, `e406`, `end`: Flags relacionadas ao estado e respostas do processo de resgate.
 * - `isPartner`: Indica se o usuário atual é um parceiro.
 *
 * Métodos:
 * - `ngOnInit()`: Carrega a lista de prêmios quando o componente é inicializado.
 * - `redeem(id: number)`: Tentativa de resgate de um prêmio com base em seu ID.
 * - `confirmation(name: string, cost: number, id: number)`: Prepara o componente para a confirmação de resgate, definindo detalhes do prêmio selecionado.
 * - `clearData()`: Limpa os dados e estados relacionados ao processo de resgate.
 * - `navigateToPartner(slug:string)`: Navega para a página de detalhes do parceiro com base em seu slug.
 *
 * Dependências:
 * - `apiPrizes`: Serviço que interage com a API relacionada aos prêmios.
 * - `router`: Serviço de roteamento para navegação entre componentes.
 *
 * O componente é usado principalmente para listar os prêmios disponíveis e permitir que os usuários resgatem prêmios.
 */
@Component({
  selector: 'app-prizes',
  templateUrl: './prizes.component.html',
  styleUrls: ['./prizes.component.css'],
})
export class PrizesComponent implements OnInit {
  public prizes: Prizes[];
  public categorys: any;
  public loader: boolean = false;

  public prizeId: number;
  public prizeName: string;
  public prizeCost: number;
  public success: boolean = false;
  public e402: boolean = false;
  public e400: boolean = false;
  public e406: boolean = false;
  public end: boolean = false;

  public isPartner: boolean = false;

  constructor(public apiPrizes: PrizesService, private router: Router, private apiCreatePrize:CreatePrizeService) {}

  ngOnInit(): void {
    this.isPartner = localStorage.getItem('isPartner') === 'true';
    this.apiPrizes.loading = true;
    this.apiPrizes.getPrizes().subscribe({
      next: (data) => {
        if (data) {
          this.prizes = data;
          this.apiPrizes.isGetting = false;
          this.apiCreatePrize.getCategory().subscribe({
            next: (data) => {
              if (data) {
                this.categorys = data;
              }
            },
            complete: () => {
              this.apiPrizes.loading = false;
            }
          });
        }
      },
      error: () => {
        this.apiPrizes.isGetting = false;
        this.apiPrizes.loading = false;
      },
    });
  }

  redeem(id: number): void {
    this.loader = true;
    this.end = true;
    this.apiPrizes.redeemPrize(id).subscribe({
      next: (data) => {
        this.loader = false;
        this.apiPrizes.isPosting = false;
        this.success = true;
      },
      error: (e) => {
        this.loader = false;
        this.apiPrizes.isPosting = false;
        if (e instanceof HttpErrorResponse && e.status === 400) {
          this.e400 = true;
          console.log('Cupom já cadastrado');
        }
        if (e instanceof HttpErrorResponse && e.status === 402) {
          this.e402 = true;
          console.log('Usuário não possui pontos suficientes');
        }
        if (e instanceof HttpErrorResponse && e.status === 406) {
          this.e406 = true;
          console.log('Cupom Esgotado');
        }
      },
    });
  }

  confirmation(name: string, cost: number, id: number): void {
    this.loader = true;
    this.prizeName = name;
    this.prizeCost = cost;
    this.prizeId = id;
    this.loader = false;
  }

  clearData(): void {
    this.prizeName = '';
    this.prizeCost = null;
    this.prizeId = null;
    this.e400 = false;
    this.e402 = false;
    this.e406 = false;
    this.success = false;
    this.end = false;
  }

  navigateToPartner(slug: string): void {
    this.router.navigate(['parceiros', slug]);
  }
}
