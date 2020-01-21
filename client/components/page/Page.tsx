import React from 'react';

import { Id } from '../../../types';


export interface PageProps {
    // pageIndex: number;
    // page: PageObj;
    // id: Id;
    // templates: Template<PageObj | SectionObj | ComponentState>[]; (should be its own thing I think)
    pageId: Id;
    content: string;
    
    // applyPageStyles: (pageIndex: number) => void;
    // updatePageState: (pageUpdate: Partial<PageObj>, pageIndex: number) => void;
    // setPageStateFromTemplate: (template: Template<PageObj>) => void;
    // createTemplate: (type: TemplateType, templateTitle: string) => void;
    // addSection: (section: Template<SectionObj>) => void;
    // deleteTemplate: (templateIndex: number) => void;

    // updateGridSectionState: (gridSectionUpdate: Partial<GridSectionObj>, sectionInFocusIndex: number, gridSectionInFocusIndex: number) => void;
    // applyGridSectionStyles: (sectionInFocusIndex: number, gridSectionInFocusIndex: number) => void;
    // updateSectionState: (sectionUpdate: Partial<GridSectionObj>, gridSectionInFocusIndex: number) => void;
    // applySectionStyles: (sectionInFocusIndex: number) => void;
    // addComponent: (type: string, template: Template<ComponentState>) => void;
    // updateComponentState: (componentUpdate: Partial<ComponentState>, sectionIndex: number, gridSectionIndex: number, componentStateIndex: number) => void;
    // applyComponentStyles: (sectionIndex: number, gridSectionIndex: number, componentStateIndex: number) => void;
    // updateSectionLayout: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export interface PageState {

}

export default class Page extends React.Component<PageProps, PageState> {    
    constructor(props: PageProps) {
        super(props);
    }


    render() {
        return (
            <div>
                <h3>This is page: {this.props.pageId}</h3>
                <p>
                    { this.props.content }
                </p>
            </div>
        )   
    }
}