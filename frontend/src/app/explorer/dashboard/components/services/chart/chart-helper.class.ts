import * as Highcharts from 'highcharts';
export class ChartHelper {
  protected chartType: any;
  commonProperties(): Highcharts.Options {
    return {
      title: {
        text: undefined
      },
      responsive: {
        rules: this.responsiveRules()
      },
      credits: {
        enabled: false
      },
      legend: this.legendAttributes()
    };
  }

  private legendAttributes(): Highcharts.LegendOptions {
    return {
      itemStyle: {
        color: '#000000'
      },
      enabled: true,
      layout: 'horizontal',
      floating: this.chartType === 'map',
      align: this.chartType === 'pie' ? 'right' : 'center',
      verticalAlign:
        this.chartType === 'map' || this.chartType === 'packed-bubble' || this.chartType === 'packed-bubble-split' || this.chartType === 'column'
          ? 'bottom'
          : 'middle',
      navigation: {
        activeColor:'#3E576F',
        animation: true,
        arrowSize: 12,
        inactiveColor: '#CCCCCC',
        style: {
          fontWeight: 'bold',
          color: '#333333',
          fontSize: '12px'
        }
      } as Highcharts.LegendNavigationOptions
    };
  }

  private responsiveRules(): Highcharts.ResponsiveRulesOptions[] {
    return [
      {
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            enabled: false
          }
        }
      } as Highcharts.ResponsiveRulesOptions
    ];
  }
}
