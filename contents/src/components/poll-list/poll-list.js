(function () {
// >>excludeStart("buildExclude", pragmas.buildExclude);
    /* global define */
    define([
        'jQuery',
        '../dress.closet'
    ], function ($, dress) {
        

// >>excludeEnd("buildExclude");

        var __window = window,
            listTypeArr = [
                'none', 'square', 'disc', 'circle', 'decimal',
                'decimal-leading-zero', 'upper-alpha', 'upper-latin',
                'upper-roman', 'lower-alpha', 'lower-greek', 'lower-latin',
                'lower-roman'];

        /*
         ###Usage
         <closet-poll-list [answer={NUMBER}]>
         [
             <li class="closet-poll-list-item"> {STRING} </li>,
             <li class="closet-poll-list-item"> {STRING} </li>,
            ...
         ]
         </closet-poll-list>

         ###Event
         * correct.answer : Fired if user select the right answer(same as value of "answer" attribute)
         * wrong.answer : Fired if user select the wrong answer(same as value of "answer" attribute)

         ###Example
         <closet-poll-list answer="2">
         <li id="closet-poll-list-item-1" class="closet-poll-list-item">Answer 1</li>
         <li id="closet-poll-list-item-2" class="closet-poll-list-item">Answer 2</li>
         </closet-poll-list>

         */
        dress.PollList = dress.factory('poll-list', {
            defaults : {
                // set Attributes type
                answer : 1,
                listType : 'none',
                contentsList: []
            },
            events : {
                click : '_isRightAnswer'
            },
            // Base LifeCycle
            onCreated : function () {
                this._initialize();
            },
            // Additional Method
            _initialize : function () {
                this.options.contentsList = [];
                this._itemClass = 'closet-poll-list-item';

                this._readDefaultContents();
            },
            _readDefaultContents : function () {
                var itemList;
                itemList = this.$el.find('.' + this._itemClass);
                if (itemList.length > 0) {
                    this._saveAllListItems(itemList);
                } else {
                    this._addDefaultItem();
                }
            },

            _saveAllListItems : function (itemList) {
                var i, length;
                length = itemList.length;

                if (length === 0) {
                    return false;
                }

                for (i = 0; i < length; i += 1) {
                    this._saveListItem(itemList[i].textContent);
                }

                return true;
            },
            _saveListItem : function (contents) {
                this.options.contentsList.push(contents);
            },
            _addDefaultItem : function () {
                this.$el.append(this._createListItem('List Item 1'));
            },
            _createListItem : function (contents) {
                var $element = $(document.createElement('li'));
                $element.addClass(this._itemClass);
                $element.text(contents || '');
                this.options.contentsList.push(contents);

                return $element;
            },
            _applyContent : function (index, contents) {
                var contentsLength = this.options.contentsList.length;
                if (index < contentsLength) {
                    $(this.$el.find('.' + this._itemClass)[index]).text(contents);
                    this.options.contentsList[index] = contents;
                }

                return this;
            },

            _removeListItem : function (index) {
                this.options.contentsList.splice(index, 1);
                $(this.$el.find('.' + this._itemClass)[index]).remove();

                return this;
            },
            _isRightAnswer : function (e) {
                var idx = this.$el.find('.' + this._itemClass).index(e.target);

                if (idx > -1) {
                    if (idx + 1 === parseInt(this.answer, 10)) {
                        this.trigger('correct.answer');
                    } else {
                        this.trigger('wrong.answer');
                    }
                }

                return this;
            },

            setAnswer : function (value) {
                this.options.answer = value;
                return this;
            },
            getAnswer : function () {
                return this.options.answer;
            },
            setListType : function (value) {
                if (listTypeArr.indexOf(value) > -1) {
                    this.options.listType = value;
                    this.$el.css('list-style', value);
                } else {
                    throw Error('Not Supported List Type');
                }

                return this;
            },
            getListType : function () {
                return this.options.listType;
            },
            getContentsList : function () {
                return this.options.contentsList;
            },
            setContentsList : function (contentsList) {
                this.applyContents(contentsList);
                this.options.contentsList = contentsList;
                return this;
            },
            applyContents : function (contents) {
                var i,
                    newContentsLength = contents.length || 0,
                    oldContentsLength = this.options.contentsList.length;


                if (oldContentsLength <= newContentsLength) {
                    for (i = 0; i < oldContentsLength; i += 1) {
                        this._applyContent(i, contents[i]);
                    }

                    for (i; i < newContentsLength; i += 1) {
                        this.$el.append(this._createListItem(contents[i]));
                    }
                } else {
                    for (i = 0; i < newContentsLength; i += 1) {
                        this._applyContent(i, contents[i]);
                    }

                    for (i = oldContentsLength - 1; i >= newContentsLength; i -= 1) {
                        this._removeListItem(i);
                    }
                }
                return this;
            }
        }, __window.HTMLUListElement);

// >>excludeStart("buildExclude", pragmas.buildExclude);
        return dress.PollList;
    });
// >>excludeEnd("buildExclude");
}());
