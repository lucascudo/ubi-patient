import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EntityService } from '../../services/entity.service';
import { Entity } from '../../interfaces/entity';

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
    MatToolbarModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class HomePatientComponent {
  protected dataSource: any[] = [];
  protected displayedColumns: string[] = ['type', 'name', 'description', 'image', 'actions'];
  protected entityTypes = ['Medicação', 'Hervanária', 'Alergia', 'Intolerância', 'Sintoma'];
  private entityService = inject(EntityService);
  protected entityForm = new FormGroup({
    type: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    description: new FormControl(),
    image: new FormControl()
  });

  ngOnInit() {
    const interval = setInterval(() => {
      if (!this.entityService.isReady()) return;
      this.loadEntities();
      clearInterval(interval);
    }, 200);
  }

  loadEntities() {
    this.entityService.getEntities().subscribe((data: Entity[]) => this.dataSource = data);
  }

  addEntity() {
    if (this.entityForm.valid) {
      this.entityService.addEntity(this.entityForm.value).then(() => {
        this.entityForm.reset();
        this.loadEntities();
      }).catch(console.error);
    }
  }

  removeEntity(index: number) {
    this.entityService.deleteEntity(this.dataSource[index]).then(() => {
      this.loadEntities();
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.entityForm.patchValue({ image: file });
    }
  }
}
