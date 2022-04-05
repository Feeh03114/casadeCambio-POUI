import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { PoDialogModule, PoModalModule } from '@po-ui/ng-components';
import { PoModule } from '@po-ui/ng-components';

@NgModule({
  imports: [CommonModule, FormsModule, PoModule, PoModalModule],
  exports: [CommonModule, FormsModule, PoDialogModule, PoModule, PoModalModule],
})
export class SharedModule {}
