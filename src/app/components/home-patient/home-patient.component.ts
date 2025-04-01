import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EntityService } from '../../services/entity.service';
import { Entity } from '../../interfaces/entity';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CryptService } from '../../services/crypt.service';
import { EntityViewDialogComponent } from '../entity-view-dialog/entity-view-dialog.component';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-home-patient',
  standalone: true,
  templateUrl: './home-patient.component.html',
  styleUrl: './home-patient.component.scss',
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class HomePatientComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly baseColumns = ['type', 'name', 'timestamp']
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly entityService = inject(EntityService);
  private readonly cryptService = inject(CryptService);
  private readonly configService = inject(ConfigService);
  protected defaultDataSource: any[] = [];
  protected dataSource: any[] = [];
  protected displayedColumns: string[] = [];
  protected today = new Date();
  protected entityTypes: any = {};
  protected readonly _object = Object;
  protected readonly entityForm = new FormGroup({
    type: new FormControl('', Validators.required),
    description: new FormControl('', Validators.maxLength(500)),
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
    ]),
    timestamp: new FormControl('', [
      Validators.required,
      (control: AbstractControl): ValidationErrors | null => {
        const isFuture = new Date(control.value) > new Date(this.today);
        return isFuture ? { future: {value: control.value} } : null;
      }
    ]), 
    image: new FormControl(),
  });

  ngOnInit() {
    this.configService.getEntityTypes().then(et => this.entityTypes = et);
    const interval = setInterval(() => {
      if (!this.entityService.isReady()) return;
      this.entityService.getEntities().subscribe((data: any[]) => {
        const decryptedData: Entity[] = data.map(entity => this.cryptService.decryptObject(entity));
        this.defaultDataSource = decryptedData.sort((a, b) => a.timestamp.localeCompare(b.timestamp)).reverse();
        this.dataSource = [ ...this.defaultDataSource ];
      });
      clearInterval(interval);
    }, 200);
    this.breakpointObserver.observe(Breakpoints.Handset).subscribe(result => {
      const handsetColumns = this.baseColumns.concat(['actions']);
      const allColumns = this.baseColumns.concat(['description', 'image', 'actions']);
      this.displayedColumns = (result.matches) ? handsetColumns : allColumns;
    });
    this.today.setHours(23, 59, 59);
  }

  addEntity(formDirective: FormGroupDirective, fileInput: HTMLInputElement) {
    if (!this.entityForm.valid) {
      return;
    }
    const entity = this.entityForm.value;
    const reload = () => {
      this.entityForm.reset();
      formDirective.resetForm();
      fileInput.value = '';
    };
    if (!entity.image) {
      return this.entityService.addEntity(entity).then(reload);
    }
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        const base64Image = reader.result as string;
        const entityWithImage = {
          ...entity,
          image: base64Image,
        };
        this.entityService.addEntity(entityWithImage).then((result) => {
          reload();
          resolve(result);
        }).catch(reject);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(entity.image);
    });
  }

  onFileChange(event: any) {
    const image = event.target.files[0];
    if (image) {
      this.entityForm.patchValue({ image });
    }
  }
  

  openDeletionDialog(index: number): void {
    const entity = this.dataSource[index];
    const article = this.entityTypes[entity.type].isMasculine ? 'o' : 'a';
    const content = `Remover ${article} ${entity.type}: ${entity.name}?`;
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Confirmação de Remoção', content },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.entityService.deleteEntity(entity);
    });
  }
  
  openDetailsDialog(index: number): void {
    this.dialog.open(EntityViewDialogComponent, {
      data: this.dataSource[index]
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (filterValue) {
      this.dataSource = this.defaultDataSource.filter(entity => {
        const searchableColumns = this.baseColumns.concat(['description']);
        for (let key of searchableColumns) {
          if (entity[key].trim().toLowerCase().includes(filterValue)) return true;
        }
        return false;
      });
    } else {
      this.dataSource = [ ...this.defaultDataSource ];
    }
  }
}
