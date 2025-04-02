import { inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { EntityViewDialogComponent } from "../entity-view-dialog/entity-view-dialog.component";
import { Entity } from "../../interfaces/entity";
import { CryptService } from "../../services/crypt.service";
import { BreakpointState } from "@angular/cdk/layout";

export abstract class BasePatient {
  private readonly baseColumns = ['type', 'name', 'timestamp'];
  protected readonly dialog = inject(MatDialog);
  protected readonly cryptService = inject(CryptService);
  protected defaultDataSource: any[] = [];
  protected displayedColumns: string[] = [];
  protected dataSource: any[] = [];
  protected handleEntities = (data: any[]) => {
    const decryptedData: Entity[] = data.map(entity => this.cryptService.decryptObject(entity));
    this.defaultDataSource = decryptedData.sort((a, b) => a.timestamp.localeCompare(b.timestamp)).reverse();
    this.dataSource = [ ...this.defaultDataSource ];
  }
  protected handleDisplayedColumns = (result: BreakpointState) => {
    const handsetColumns = this.baseColumns.concat(['actions']);
    const allColumns = this.baseColumns.concat(['description', 'image', 'actions']);
    this.displayedColumns = (result.matches) ? handsetColumns : allColumns;
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