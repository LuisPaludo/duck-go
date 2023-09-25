import { Component, OnInit } from '@angular/core';
import { PrizesService } from './api/prizes.service';
import { Prizes } from './models/prizes';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CreatePrizeService } from './create/api/create-prize.service';
import { FormBuilder, FormGroup } from '@angular/forms';
/**
 * PrizesComponent - Componente Angular que lida com a exibição e gerenciamento de prêmios.
 *
 * Propriedades:
 * - `prizes` e `filteredPrizes`: Listas de prêmios recuperados e filtrados.
 * - `categorys`: Categorias de prêmios.
 * - `loader`: Indicador de carregamento.
 * - `filter`: Formulário para filtrar prêmios.
 * - `prizeId`, `prizeName`, `prizeCost`: Informações para confirmação de resgate de prêmio.
 * - `success`, `e402`, `e400`, `e406`, `end`, `noPrizes`: Flags para controle de estados e erros.
 * - `isPartner`: Indica se o usuário é um parceiro.
 *
 * Métodos:
 * - `ngOnInit`: Inicialização do componente, busca prêmios e define observáveis de formulário.
 * - `switch`: Filtra e ordena a lista de prêmios de acordo com as opções escolhidas.
 * - `subscribeForms`: Configura observadores para mudanças nos campos do formulário de filtro.
 * - `search`: Filtra prêmios pelo nome da empresa geradora.
 * - `redeem`: Resgata um prêmio, fazendo a chamada à API.
 * - `confirmation`: Define os dados para a confirmação de resgate.
 * - `clearData`: Limpa dados relacionados à confirmação e erros de resgate.
 * - `navigateToPartner`: Navega para a página do parceiro.
 *
 * O principal objetivo deste componente é fornecer uma interface para os usuários visualizarem, filtrarem e resgatarem prêmios.
 */
@Component({
  selector: 'app-prizes',
  templateUrl: './prizes.component.html',
  styleUrls: ['./prizes.component.css'],
})
export class PrizesComponent implements OnInit {
  public prizes: Prizes[];
  public filteredPrizes: Prizes[];
  public categorys: any;
  public loader: boolean = false;
  public filter!: FormGroup;

  public prizeId: number;
  public prizeName: string;
  public prizeCost: number;
  public success: boolean = false;
  public e402: boolean = false;
  public e400: boolean = false;
  public e406: boolean = false;
  public end: boolean = false;
  public noPrizes: boolean = true;

  public isPartner: boolean = false;

  constructor(
    public apiPrizes: PrizesService,
    private router: Router,
    private apiCreatePrize: CreatePrizeService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.isPartner = localStorage.getItem('isPartner') === 'true';
    this.apiPrizes.loading = true;
    this.apiPrizes.getPrizes().subscribe({
      next: (data) => {
        if (data) {
          if (data.length) {
            this.noPrizes = false;
          }
          this.prizes = data;
          this.filteredPrizes = data;
          this.switch(4, 2);

          this.apiPrizes.isGetting = false;
          this.apiCreatePrize.getCategory().subscribe({
            next: (data) => {
              if (data) {
                this.categorys = data;
              }
            },
            complete: () => {
              this.apiPrizes.loading = false;
            },
          });
        }
      },
      error: () => {
        this.apiPrizes.isGetting = false;
        this.apiPrizes.loading = false;
      },
    });
    this.filter = this.formBuilder.group({
      filter: ['4'],
      order: ['2'],
      partner: [''],
    });
    this.subscribeForms();
  }

  switch(filter: number, order: number) {
    this.search();
    switch (filter) {
      case 1:
        if (order == 2) {
          this.filteredPrizes.sort((a, b) => b.name.localeCompare(a.name));
        } else {
          this.filteredPrizes.sort((a, b) => a.name.localeCompare(b.name));
        }
        break;

      case 2:
        if (order == 2) {
          this.filteredPrizes.sort((a, b) =>
            b.expiry_date.localeCompare(a.expiry_date)
          );
        } else {
          this.filteredPrizes.sort((a, b) =>
            a.expiry_date.localeCompare(b.expiry_date)
          );
        }
        break;

      case 3:
        if (order == 2) {
          this.filteredPrizes.sort((a, b) =>
            b.generated_by_company_name.localeCompare(
              a.generated_by_company_name
            )
          );
        } else {
          this.filteredPrizes.sort((a, b) =>
            a.generated_by_company_name.localeCompare(
              b.generated_by_company_name
            )
          );
        }
        break;

      case 4:
        if (order == 2) {
          this.filteredPrizes.sort((a, b) => {
            return b.cost_in_points - a.cost_in_points;
          });
        } else {
          this.filteredPrizes.sort((a, b) => {
            return a.cost_in_points - b.cost_in_points;
          });
        }
        break;

      case 5:
        if (order == 2) {
          this.filteredPrizes.sort((a, b) => {
            return b.times_to_be_used - a.times_to_be_used;
          });
        } else {
          this.filteredPrizes.sort((a, b) => {
            return a.times_to_be_used - b.times_to_be_used;
          });
        }
        break;

      default:
        if (filter > 5) {
          const selectedCategory = this.categorys[filter - 6];
          this.filteredPrizes = this.prizes.filter((prize) => {
            return prize.category === selectedCategory.id;
          });
        }
        break;
    }
  }

  subscribeForms(): void {
    this.filter.get('filter').valueChanges.subscribe((value) => {
      const order = parseInt(this.filter.get('order').value);
      this.switch(parseInt(value), order);
    });
    this.filter.get('order').valueChanges.subscribe((value) => {
      const filter = parseInt(this.filter.get('filter').value);
      this.switch(filter, parseInt(value));
    });
    this.filter.get('partner').valueChanges.subscribe(() => {
      this.search();
    });
  }

  search() {
    this.filteredPrizes = this.prizes.filter((prize) =>
      prize.generated_by_company_name.toLowerCase().includes(this.filter.get('partner').value.toLowerCase())
    );
  }

  redeem(id: number): void {
    this.loader = true;
    this.end = true;
    this.apiPrizes.redeemPrize(id).subscribe({
      next: () => {
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
