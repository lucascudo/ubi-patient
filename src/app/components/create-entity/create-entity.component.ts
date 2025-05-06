import { Component, inject, OnInit } from '@angular/core';
import { EntityService } from '../../services/entity.service';
import { ConfigService } from '../../services/config.service';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { HasUnsavedChanges } from '../../guards/unsaved-changes.guard';

@Component({
  selector: 'app-create-entity',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-entity.component.html',
  styleUrl: './create-entity.component.scss'
})
export class CreateEntityComponent implements OnInit, HasUnsavedChanges{
  private readonly entityService = inject(EntityService);
  private readonly configService = inject(ConfigService);
  private readonly router = inject(Router);
  private readonly maxImageStringSize = 932540;
  protected entityTypes: any = {};
  protected readonly _object = Object;
  protected readonly entityForm = new FormGroup({
    type: new FormControl('', Validators.required),
    timestamp: new FormControl('', Validators.required),
    description: new FormControl('', Validators.maxLength(500)),
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(50)
    ]),
    image: new FormControl(null, (control: AbstractControl): ValidationErrors | null => {
      return ((control.value?.size * 1.333) > this.maxImageStringSize) ? { tooBig: {value: control.value} } : null;
    })
  });

  ngOnInit() {
    this.configService.getEntityTypes().then(et => this.entityTypes = et);
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
      this.router.navigateByUrl("/home-patient");
    };
    if (!entity.image) {
      return this.entityService.addEntity(entity).then(reload);
    }
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        const base64Image = reader.result as string;
        if (new Blob([base64Image]).size > this.maxImageStringSize) {
          const error = $localize`Unsupported image size, maximum is 680 KB`;
          alert(error);
          return reject(error);
        }
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
      reader.readAsDataURL(entity.image!);
    });
  }

  onFileChange(event: any) {
    this.entityForm.patchValue({ image: event.target.files[0] ?? null });
  }

  hasUnsavedChanges(): boolean {
    return this.entityForm.dirty;
  }
}
