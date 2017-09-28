import { Component, OnInit } from '@angular/core';
import { process, State } from '@progress/kendo-data-query';
import { HttpService } from "../services/http.service";
import _ from 'lodash';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [HttpService]
})
export class HomeComponent implements OnInit {
  public title: String;
  public showCriteria: boolean;
  public fieldVals: Array<String>;
  public operatorVals: Array<String>;
  public operatorVals2: Array<String>;
  public operatorVals3: Array<String>;
  public strOperatorVals: Array<String>;
  public numOperatorVals: Array<String>;
  public criterias: any[];
  public query_string: String;
  public operator3: any;

  constructor(
    private httpService:HttpService
  ) {
    this.title = 'Custom Multiple Filter';
    this.fieldVals = ['ID', 'Name', 'Number', 'City', 'State', 'Zip', 'Total Amount'];
    this.operatorVals = [];
    this.operatorVals2 = ['and', 'or'];
    this.operatorVals3 = ['AND', 'OR'];
    this.strOperatorVals = ['Is equal to', 'Is not equal to', 'Contains', 'Does not contain'];
    this.numOperatorVals = ['=', '!=', '>=', '>', '<=', '<'];
    this.showCriteria = false;
    this.criterias = [];
    this.operator3 = '';
  }

  ngOnInit() {

  }

  addCriteria() {
    this.showCriteria = true;

    if (this.criterias.length < 1 || (this.criterias[this.criterias.length - 1].val)) {
      this.criterias.push({showField: true, showOperator2: true});
    }
  }

  onChange(type, val, index) {
    if(type == 'field'){
      if(val != 'Field'){
        if(val == 'ID' || val == 'Number' || val == 'Total Amount'){
          this.criterias[index].operatorVals = this.numOperatorVals;
        } else{
          this.criterias[index].operatorVals = this.strOperatorVals;
        }

        this.criterias[index].showOperator = true;
        this.criterias[index].operator = this.criterias[index].operatorVals[-1];
      }
      else{
        this.criterias[index].showOperator = false;
        this.criterias[index].showVal = false;
      }
    }
    else if (type == 'operator'){
      if(val != 'Criteria Operator'){
        this.criterias[index].showVal = true;
      }
      else{
        this.criterias[index].showVal = false;
      }
    }
  }

  filter() {
    let filterData = {
      operator3: '',
      data: []
    };

    if(this.operator3 && this.operator3 != 'AND/OR'){
      filterData.operator3 = this.operator3;
    }

    _.forEach(this.criterias, function(item) {
      if(item.operator2 && item.operator2 != ''){
        filterData.data.push({
          operator2: item.operator2,
          items: [_.pick(item, ['field', 'operator', 'val'])]
        })
      }else {
        if(filterData.data.length){
          filterData.data[filterData.data.length - 1].items.push(_.pick(item, ['field', 'operator', 'val']));
        }
        else{
          item.operator2 = 'and';

          filterData.data.push({
            operator2: item.operator2,
            items: [_.pick(item, ['field', 'operator', 'val'])]
          })
        }
      }
    });

    if(filterData.data.length > 1 && filterData.operator3 == ''){
      filterData.operator3 = this.operator3 = "AND";
    }
    console.log(filterData);

    if(filterData.data.length > 0){
      this.httpService.filterCompanies(filterData).subscribe (
          res => {
            this.query_string = res.query_string;
          },
          err => {
            console.log(err, 'filtering companies error');
          }
      )
    }
  }

  clear() {
    this.criterias = [];
    this.query_string = '';
  }
}
