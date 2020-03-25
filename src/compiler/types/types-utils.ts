import * as d from '../../declarations';

export const COMPONENTS_DTS_HEADER = `
  /* eslint-disable */
  /* tslint:disable */
  /**
   * This is an autogenerated file created by the Stencil compiler.
   * It contains typing information for all components that exist in this project.
   */
`;

export const sortImportNames = (a: d.TypesMemberNameData, b: d.TypesMemberNameData) => {
  const aName = a.localName.toLowerCase();
  const bName = b.localName.toLowerCase();
  if (aName < bName) return -1;
  if (aName > bName) return 1;
  if (a.localName < b.localName) return -1;
  if (a.localName > b.localName) return 1;
  return 0;
};
