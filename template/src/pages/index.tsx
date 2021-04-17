import React, { useRef, useEffect } from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import 'bpmn-js/dist/assets/diagram-js.css'; // 左边工具栏以及编辑节点的样式
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import DefaultEmptyXML from '../utils/bpmnInit';
import camundaModdleDescriptor from '../utils/camundaDescriptor.json';
import activitiModdleDescriptor from '../utils/activitiDescriptor.json';

const prefix: string = 'activiti';
let bpmnModeler = new BpmnModeler();
const Index = () => {
    const BpmnRef = useRef(null);
    let moddleExtension = {};

    const moddleExtensions = () => {
        const Extensions = {
            camunda: undefined,
            activiti: undefined,
        };

        // 插入用户自定义模块
        if (moddleExtension) {
            for (let key in moddleExtension) {
                // @ts-ignore
                Extensions[key] = moddleExtension[key];
            }
        }

        if (prefix === 'activiti') {
            Extensions.activiti = activitiModdleDescriptor;
        }

        if (prefix === 'camunda') {
            Extensions.camunda = camundaModdleDescriptor;
        }

        return Extensions;
    };

    const init = async () => {
        bpmnModeler = new BpmnModeler({
            container: BpmnRef.current,
            propertiesPanel: {
                parent: '#js-properties-panel',
            },
            additionalModules: [propertiesProviderModule],
            moddleExtensions: moddleExtensions(),
        });

        await createNewDiagram('');
    };

    //新建一个xml
    const createNewDiagram = async (xml: string) => {
        let xmlStr =
            xml || DefaultEmptyXML(new Date().getTime(), '测试流程', prefix);

        await bpmnModeler.importXML(xmlStr);
        await bpmnModeler.get('canvas').zoom('fit-viewport', 'auto');
    };

    useEffect(() => {
        init();
    }, []);

    return (
        <div className={'bpmn-container'}>
            <div ref={BpmnRef} className={'bpmn-canvas'} />
            <div id="js-properties-panel" className={'bpmn-panel'} />
        </div>
    );
};

export default Index;
