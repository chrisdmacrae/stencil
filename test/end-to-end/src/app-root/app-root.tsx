import { Component, State, h } from '@stencil/core';
import _ from 'lodash';
import _es from 'lodash-es';


@Component({
  tag: 'app-root'
})
export class AppRoot {

  @State() first: string;
  @State() last: string;

  componentWillLoad() {
    const url = new URL(window.location.href);
    this.first = url.searchParams.get('first') || 'Stencil';
    this.last = url.searchParams.get('last') || 'JS';
    console.log('lodash', _.camelCase('LODASH'));
    console.log('lodash-es', _es.camelCase('LODASH-ES'));
  }

  render() {
    return <prop-cmp first={this.first} lastName={this.last} mode="ios"></prop-cmp>
  }

}
