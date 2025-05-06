import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EntityService } from '../../services/entity.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ConfigService } from '../../services/config.service';
import { BasePatient } from '../base-patient/base-patient';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-patient',
  standalone: true,
  templateUrl: './home-patient.component.html',
  styleUrl: './home-patient.component.scss',
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    DatePipe
  ]
})
export class HomePatientComponent extends BasePatient implements OnInit {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly entityService = inject(EntityService);
  private readonly configService = inject(ConfigService);
  private entityTypes: any = {};

  ngOnInit() {
    this.configService.getEntityTypes().then(et => this.entityTypes = et);
    const interval = setInterval(() => {
      if (!this.entityService.isReady()) return;
      this.entityService.getEntities().subscribe(this.handleEntities);
      clearInterval(interval);
    }, 200);
    this.breakpointObserver.observe(Breakpoints.Handset).subscribe(this.handleDisplayedColumns);
  }

  openDeletionDialog(index: number): void {
    const entity = this.dataSource[index];
    let article = 'the';
    if ($localize.locale === 'pt') {
      article = this.entityTypes[entity.type].isMasculine ? 'o' : 'a';
    }
    const content = $localize`Remove ${article} ${entity.type}\: ${entity.name}?`;
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: $localize`Removal Confirmation`, content },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.entityService.deleteEntity(entity);
    });
  }

  isFuture(timestamp: string) {
    return timestamp > new Date().toISOString().slice(0, 19);
  }
}
