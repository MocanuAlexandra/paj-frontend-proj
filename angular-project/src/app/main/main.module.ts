import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MainRoutingModule } from './main-routing.module';
import { MainPageComponent } from './components/main-page/main-page.component';
import { MainPageGuestComponent } from './components/main-page-guest/main-page-guest.component';
import { BooksDashboardComponent } from './components/books-dashboard/books-dashboard.component';
import { AddEditBookModalComponent } from './components/add-edit-book-modal/add-edit-book-modal.component';
import { BookCardComponent } from './components/book-card/book-card.component';

//ng zorro
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzProgressModule } from 'ng-zorro-antd/progress';


@NgModule({
  declarations: [
    BookCardComponent,
    MainPageComponent,
    MainPageGuestComponent,
    BooksDashboardComponent,
    AddEditBookModalComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    FormsModule,
    ReactiveFormsModule,

    //ngZorro
    NzButtonModule,
    NzProgressModule ,
    NzDropDownModule,
    NzIconModule,
    NzInputModule,
    NzPageHeaderModule,
    NzTableModule,
    NzModalModule,
    NzFormModule,
    NzSwitchModule
  ],
})
export class MainModule {}
