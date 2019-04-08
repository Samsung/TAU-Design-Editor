/**
 * Created by khanas on 10/13/15.
 */

(function() {
    var i,
        numberOfNodes = 150,
        listComponent = new Component3d.ListComponent(),
        coverFlowComponent = new Component3d.CoverFlowComponent(),
        listZoomableComponent = new Component3d.ListZoomablecomponent(),
        turnableComponent = new Component3d.TurnableComponent(),
        demoSampleDiv = document.getElementById('DemoSample'),
        nodes = [];

    for (i = 0; i < numberOfNodes; i++) {
        nodes.push({
            dom : getImageSrc()
        });
    }

    setComponent();

    function setComponent() {
        var selectedIndex = document.getElementById('DemoListType').selectedIndex;

        switch (selectedIndex) {
            case 0:
                closeCurrentPanel();
                showCoverFlowPanel();
                break;
            case 1:
                closeCurrentPanel();
                showListPanel();
                break;
            case 2:
                closeCurrentPanel();
                showListZoomablePanel();
                break;
            case 3:
                closeCurrentPanel();
                showTurnablePanel();
                break;
            default:
        }
    }

    function closeCurrentPanel() {

        document.getElementById('DemoListTools').style.display = 'none';
        document.getElementById('DemoListZoomableTools').style.display = 'none';
        document.getElementById('DemoCoverFlowTools').style.display = 'none';
        document.getElementById('DemoTurnableTools').style.display = 'none';

        listComponent.detachFromParent();
        listZoomableComponent.detachFromParent();
        coverFlowComponent.detachFromParent();
        turnableComponent.detachFromParent();
    }

    function showCoverFlowPanel() {

        document.getElementById('DemoCoverFlowTools').style.display = 'block';

        coverFlowComponent.setBackground('rgb(5, 5, 5)')
            .setComponentMargin(0, 50)
            .setScrollingIndex(0)
            .setComponentSize(100, 100)
            .setComponentWidthMeasure('%')
            .setComponentHeightMeasure('%')
            .setNodeWidth(500)
            .setNodeHeight(500)
            .setNodeMargin(0, 20)
            .insert(nodes, 0)
            .setNumberOfStacks(1)
            .setDirection(1)
            .attachToParent(demoSampleDiv)
            .update();
    }

    function showListPanel() {

        document.getElementById('DemoListTools').style.display = 'block';

        listComponent.setBackground('rgb(0, 0, 0)')
            .setComponentMargin(200, 100)
            .setScrollingIndex(0)
            .setComponentSize(100, 100)
            .setComponentWidthMeasure('%')
            .setComponentHeightMeasure('%')
            .setNodeMargin(100, 50)
            .insert(nodes, 0)
            .setNumberOfStacks(3)
            .setDistanceZBetweenNodes(300)
            .attachToParent(demoSampleDiv)
            .update();
    }

    function showListZoomablePanel() {

        document.getElementById('DemoListZoomableTools').style.display = 'block';

        listZoomableComponent.setBackground('rgb(10, 10, 10)')
            .setComponentMargin(0, 100)
            .setScrollingIndex(0)
            .setComponentSize(100, 100)
            .setComponentWidthMeasure('%')
            .setComponentHeightMeasure('%')
            .setNodeWidth(250)
            .setNodeHeight(250)
            .setNodeMargin(20, 20)
            .insert(nodes, 0)
            .setNumberOfStacks(3)
            .setDirection(1)
            .setDepth(0)
            .setZoomDirection(1)
            .attachToParent(demoSampleDiv)
            .update();
    }

    function showTurnablePanel() {

        document.getElementById('DemoTurnableTools').style.display = 'block';

        turnableComponent.setBackground('rgb(15, 15, 15)')
            .setComponentMargin(45, 100)
            .setScrollingIndex(0)
            .setComponentSize(1200, 600)
            .setNodeMargin(200, 30)
            .insert(nodes, 0)
            .setNumberOfStacks(2)
            .setDirection(1)
            .setUseRotatePositioning(1)
            .setSide(1)
            .setUseOpacity(true)
            .setNumberOfNodesInCircle(8)
            .attachToParent(demoSampleDiv)
            .update();
    }














    document.getElementById('DemoListType').onchange = function(e) {
        setComponent();
    };



    document.getElementById('ListStackMinus').onclick = function() {
        if (listComponent.getNumberOfStacks() > 1) {
            listComponent.setNumberOfStacks(listComponent.getNumberOfStacks() - 1);
        }
        listComponent.update();
    };
    document.getElementById('ListStackPlus').onclick = function() {
        listComponent.setNumberOfStacks(listComponent.getNumberOfStacks() + 1);
        listComponent.update();
    };
    document.getElementById('ListElementPlus').onclick = function() {
        listComponent.insert({
            dom : getImageSrc()
        }, 0);
        listComponent.update();
    };
    document.getElementById('ListZDistanceMinus').onclick = function() {
        if (listComponent.getDistanceZBetweenNodes() >= 300) {
            listComponent.setDistanceZBetweenNodes(listComponent.getDistanceZBetweenNodes() - 50);
        }
        listComponent.update();
    };
    document.getElementById('ListZDistancePlus').onclick = function() {
        listComponent.setDistanceZBetweenNodes(listComponent.getDistanceZBetweenNodes() + 50);
        listComponent.update();
    };



    document.getElementById('CoverFlowStackMinus').onclick = function() {
        if (coverFlowComponent.getNumberOfStacks() > 1) {
            coverFlowComponent.setNumberOfStacks(coverFlowComponent.getNumberOfStacks() - 1);
        }
        coverFlowComponent.update();
    };
    document.getElementById('CoverFlowStackPlus').onclick = function() {
        coverFlowComponent.setNumberOfStacks(coverFlowComponent.getNumberOfStacks() + 1);
        coverFlowComponent.update();
    };
    document.getElementById('CoverFlowDirection').onclick = function() {
        coverFlowComponent.setDirection(-1 * coverFlowComponent.getDirection());
        coverFlowComponent.update();
    };
    document.getElementById('CoverFlowElementMinus').onclick = function() {
        var coverFlowElementIndex = coverFlowComponent.getCollectionLength() - 1;
        coverFlowComponent.remove(coverFlowElementIndex);
        coverFlowComponent.update();
    };
    document.getElementById('CoverFlowElementPlus').onclick = function() {
        coverFlowComponent.insert({
            dom : getImageSrc()
        }, coverFlowComponent.getCollectionLength());
        coverFlowComponent.update();
    };



    document.getElementById('ListZoomableStackMinus').onclick = function() {
        if (listZoomableComponent.getNumberOfStacks() > 1) {
            listZoomableComponent.setNumberOfStacks(listZoomableComponent.getNumberOfStacks() - 1);
        }
        listZoomableComponent.update();
    };
    document.getElementById('ListZoomableStackPlus').onclick = function() {
        listZoomableComponent.setNumberOfStacks(listZoomableComponent.getNumberOfStacks() + 1);
        listZoomableComponent.update();
    };
    document.getElementById('ListZoomableElementPlus').onclick = function() {
        listZoomableComponent.insert({
            dom : getImageSrc()
        }, 0);
        listZoomableComponent.update();
    };
    document.getElementById('ListZoomableDirection').onclick = function() {
        listZoomableComponent.setDirection(-1 * listZoomableComponent.getDirection());
        listZoomableComponent.update();
    };
    document.getElementById('ListZoomableZoomDirectionMinus').onclick = function() {
        listZoomableComponent.setZoomDirection(listZoomableComponent.getZoomDirection() - 1);
        listZoomableComponent.update();
    };
    document.getElementById('ListZoomableZoomDirectionPlus').onclick = function() {
        listZoomableComponent.setZoomDirection(listZoomableComponent.getZoomDirection() + 1);
        listZoomableComponent.update();
    };
    document.getElementById('ListZoomableZoomValueMinus').onclick = function() {
        listZoomableComponent.setDepth(listZoomableComponent.getDepth() - 100);
        listZoomableComponent.update();
    };
    document.getElementById('ListZoomableZoomValuePlus').onclick = function() {
        listZoomableComponent.setDepth(listZoomableComponent.getDepth() + 100);
        listZoomableComponent.update();
    };



    document.getElementById('TurnableMinus').onclick = function() {
        if (turnableComponent.getNumberOfStacks() > 1) {
            turnableComponent.setNumberOfStacks(turnableComponent.getNumberOfStacks() - 1);
        }
        turnableComponent.update();
    };
    document.getElementById('TurnablePlus').onclick = function() {
        turnableComponent.setNumberOfStacks(turnableComponent.getNumberOfStacks() + 1);
        turnableComponent.update();
    };
    document.getElementById('TurnableElementPlus').onclick = function() {
        turnableComponent.insert({
            dom : getImageSrc()
        }, 0);
        turnableComponent.update();
    };
    document.getElementById('TurnableDirection').onclick = function() {
        turnableComponent.setDirection(-1 * turnableComponent.getDirection());
        turnableComponent.update();
    };
    document.getElementById('TurnableRotation').onclick = function() {
        turnableComponent.setUseRotatePositioning(-1 * turnableComponent.getUseRotatePositioning());
        turnableComponent.update();
    };
    document.getElementById('TurnableSide').onclick = function() {
        turnableComponent.setSide(-1 * turnableComponent.getSide());
        turnableComponent.update();
    };
    document.getElementById('TurnableUseOpacity').onclick = function() {
        turnableComponent.setUseOpacity(!turnableComponent.getUseOpacity());
        turnableComponent.update();
    };
    document.getElementById('TurnableNumberOfItemsMinus').onclick = function() {
        if (turnableComponent.getNumberOfNodeInCircle() >= 6) {
            turnableComponent.setNumberOfNodesInCircle(turnableComponent.getNumberOfNodeInCircle() - 2);
        }
        turnableComponent.update();
    };
    document.getElementById('TurnableNumberOfItemsPlus').onclick = function() {
        if (turnableComponent.getNumberOfNodeInCircle() <= 30) {
            turnableComponent.setNumberOfNodesInCircle(turnableComponent.getNumberOfNodeInCircle() + 2);
        }
        turnableComponent.update();
    };
})();
