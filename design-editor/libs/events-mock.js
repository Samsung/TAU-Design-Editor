var map = new Map();
module.exports = {
    Events: {
        StatusBarIsReady : 'global:StatusBarIsReady',
        ActiveEditorUpdated : 'global:ActiveEditorUpdated',
        ElementSelected : 'global:Element.selected',
        ElementDeselected : 'global:Element.deselected',
        EditorConfigChanged: 'global:EditorConfigChanged',
        RequestCurrentSelection : 'select-layer:requestCurrentSelection',
        OpenNewProject : 'project-wizard:openNewProject',
        OpenAppPackageManager: 'app-package:openAppPackage',
        CreateNewPage : 'page-wizard:createNewPage',
        ProjectInfoLoaded : 'global:ProjectInfoLoaded',
        ToggleAnimationPanel: 'panel-manager:ToggleAnimationPanel',
        AssistantViewStateChange : 'pane-manager:AssistantViewStateChange',
        AssistantViewResized : 'assistant-view-manager:AssistantViewResized',
        ShowAssistantHighlighter : 'assistant-view-manager:ShowAssistantHighlighter',
        HideAssistantHighlighter : 'assistant-view-manager:HideAssistantHighlighter',
        StopAssistantPointerEvents : 'assistant-view-manager:StopAssistantPointerEvents',
        StartAssistantPointerEvents : 'assistant-view-manager:StartAssistantPointerEvents',
        InsertComponent: 'pane-manager:InsertComponent',
        OpenAssistantWizard: 'assistant:AssistantWizardOpen',
        AssistantWizardAccepted: 'assistant:AssistantWizardAccepted',
        ComponentDragged: 'panel-compoent:ComponentDragged',
        Lock : 'global:Element.lock',
        Unlock : 'global:Element.unlock',
        OpenPanel : 'panel-manager:OpenPanel',
        ClosePanel : 'panel-manager:ClosePanel',
        Atom: {
            onDidChangeActivePaneItem: 'atom:onDidChangeActivePaneItem',
            onDidChangePaths: 'atom:onDidChangePaths'
        },
        ChangeStyle: 'closet-editor:styleChanged',
        ChangeAttribute: 'closet-editor:attributeChanged',
        ElementInserted: 'closet-editor:elementInserted',
        StyleInserted: 'closet-editor:styleInserted',
        ScriptInserted: 'closet-editor:scriptInserted',
        ElementMoved: 'closet-editor:elementMoved',
        ElementDeleted: 'closet-editor:elementDeleted',
        ChangeContent:  'closet-editor:contentChanged',
        AnimationEventEdited: 'context-menu:animationEventEdited',
        AnimationEventRemoved: 'context-menu:animationEventRemoved',
        AnimationLabelEdited: 'context-menu:animationLabelEdited',
        AnimationLabelRemoved: 'context-menu:animationLabelRemoved',
        Show : 'closet-editor:show',
        Hide : 'closet-editor:hide',
        ToggleEditor : 'pane-manager:ToggleEditor',
        ToggleAssistantView : 'panel-manager:ToggleAssistantView',
        TogglePreviewView: 'stage-manager:togglePreviewView',
        ToggleDesignAndCodeView: 'stage-manager:toggleDesignAndCodeView',
        ToggleStructureElement: 'stage-manager:toggleStructureElement',
        ToggleButtonOnToolbar: 'toolbar-element:toggleButtonOnToolbar',
        ToggleEditMode: 'interaction:ToggleEditMode',
        ToggleLayoutDetail: 'toolbar-element:toggleLayoutDetail',
        AssistantViewOpen: 'stage-manager:codeViewOpen',
        SetNewGuide: 'guideline:SetNewGuide',
        SetNewGuideline : 'guideline:SetNewGuideline',
        DeleteAllGuide: 'guideline:DeleteAllGuide',
        ReplaceCodeView: 'assistant-view:ReplaceCodeView',
        OpenPane: 'pane-manager:OpenPane',
        ChangeElementStyle: 'attribute-element:ChangeElementStyle',
        TextToolShowed: 'select-layer:TextToolShowed',
        OpenInstantTextEditor: 'instant-text-editor:Open',
        ElementDragStart: 'closet-editor:ElementDragStart',
        ElementDragStop: 'closet-editor:ElementDragStop',
        PreviewElementToolbarBackward: 'preview-element-toolbar-backward',
        TooltipPanelOpen: 'tooltip-open',
        TooltipPanelClose: 'tooltip-close',
        ChangeProfile: 'ChangeProfile',
        ChangeShape: 'ChangeShape'
    },
    on: function (name, callback) {
        map.set(name, callback);
    },
    trigger: function (name) {
        var callback = map.get(name),
            args = [].slice.call(arguments);
        args.shift();
        if (callback) {
            callback.apply(callback, args);
        }
    }
};
