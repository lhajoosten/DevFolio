import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterByNamePipe implements PipeTransform {
  transform(items: any[], filterValue: string): any[] {
    if (!items || !filterValue) {
      return items;
    }

    const filterTerms = filterValue.split(',').map(term => term.trim().toLowerCase());

    return items.filter(item => {
      const itemName = item.name?.toLowerCase() || item.toString().toLowerCase();
      return filterTerms.some(term => itemName.includes(term));
    });
  }
}
