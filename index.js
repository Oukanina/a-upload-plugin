(function(func){
  'use scrit'

  // AMD CMD support
  if(typeof define === 'function') {
    define([],func);
  }
  if(typeof module === 'object') {
    module.exports = func();
  }

  if(!window.GkkUpload) {
    window.GkkUpload = func();
  }

})(function(){

  var ERROR = {
    INIT_CONTAINER_ERROR:"GkkUpload(dom_element) need a dom element or a selector(id|class)!",
    SELECT_ELEMENT_ERROR:"can't get the element!",
  };

  var REGEX = {
    TEST_ID:/^#.+/,
    TEST_CLASS:/^\..+/,
    TEST_HANDLER:/Handler$/,
  };

  var DEFAULT_OPTIONS = {
    // 外层容器的class
    FORM_CLASS:'gkk-upload-form',
    GKK_UPLOAD_CLASS:'gkk-upload-outter',
    UPLOAD_BUTTON_CLASS:'gkk-button gkk-upload-button hide',
    CANCLE_UPLOAD_BUTTON_CLASS:'gkk-button gkk-upload-cancle-button hide',
    FORM_P1_CLASS:'gkk-upload-form-p1',
    FORM_P2_CLASS:'gkk-upload-form-p2',
    FORM_TEXT_CLASS:'gkk-upload-form-text',
    OUTTER_DRAG_OVER_CLASS:'gkk-upload-form-over',
    FORM_DRAG_OVER_CLASS:'gkk-upload-form-form-over',
    FILE_LIST_CLASS:'gkk-upload-file-list',
    FILE_LINE_CLASS:'gkk-upload-file-line',
    FILE_NAME_CLASS:'gkk-upload-file-name',
    FILE_SIZE_CLASS:'gkk-upload-file-size',
    FILE_TYPE_CLASS:'gkk-upload-file-type',
    FILE_INFO_BOX_CLASS:'gkk-upload-file-info-box',
    FILE_UPLOAD_PROGRESS_CLASS:'cover gkk-upload-file-progress',
    FILE_UPLOAD_PROGRESS_VALUE_CLASS:'gkk-upload-file-progress-value',
    FILE_UPLOAD_VALUENUMBER_FAIL_CLASS:'file-upload-fail-progress-value-number',
    FILE_UPLOAD_PROGRESS_VALUE_NUMBER_CLASS:'gkk-upload-file-progress-value-number',
    FILE_UPLOAD_VALUENUMBER_SUCCESS_CLASS:'file-upload-success-prgress-value-number',
    POPUP_CLASS:'gkk-popup',
    FILE_UPLOAD_FAIL_CLASS:'file-upload-fail',
    FILE_UPLOAD_SUCCESS_CLASS:'file-upload-success',
    RETURN_BUTTON_CLASS:'gkk-button gkk-return-button hide',
    POPUP_ITEM_CLASS:'gkk-popup-item',
    POPUP_ITEM_ERR_CLASS:'gkk-popup-item-err',
    POPUP_ITEM_FILE_NAME_CLASS:'gkk-popup-item-file-name',
    // 内部文字
    DRAG_TEXt:' _(:3 」∠)_ 将文件拖进来 _(:3 」∠)_ ',
    SELECT_TEXT:'点我选文件',
    UPLOAD_TEXT:' 开船',
    CANCEL_UPLOAD_TEXT:'取消',
    FILE_NAME_TEXT:'文件名',
    FILE_SIZE_TEXT:'文件大小',
    FILE_TYPE_TEXT:'文件类型',
    FILE_UPLOAD_VALUENUMBER_SUCCESS_TEXT:'上传完成，正在保存中 ╮(￣▽￣)╭',
    FILE_UPLOAD_VALUENUMBER_FAIL_TEXT:'上传失败了(╯‵□′)╯︵┻━┻',
    FILE_UPLOAD_SAVE_SUCCESS_TEXT:'保存成功',
    RETURN_BUTTON_TEXT:'返回',
    // 允许的文件后缀
    ALLOW_FILE_EXTENSION:['jpg','jpeg','png','doc','zip','mp3','mp4','rar','pdf','deb','gz','docx'],
    // 允许的文件类型
    ALLOW_FILE_TYPE:['image','audio','archive','document','application'],
    // 20Mb
    ALLOW_FILE_SIZE: 20 * 1000 * 1000,
    // 自动上传
    ALLOW_AUTO:true,
    // 允许拖拽
    ALLOW_DRAG:true,
    // 图片预显
    ALLOW_IMAGE_PREVIEW:true,
    // 显示上传进度
    ALLOW_UPLOAD_PROGRESS:true,
    // 跨域上传
    ALLOW_CORS:true,
    // 多文件同时上传
    ALLOW_SIMULTANEOUSLY:true,
    // 默认名称
    FORM_UPLOAD_NAME:'file',
    // 上传路径
    UPLOAD_URL:'',
    // ajax 异步
    ASYNC:true,
    // 弹出警告窗持续时间
    POPUP_TIME_OUT:6000,
    // ajax返回json
    // JOSN:true,
    // 上传时间超时 0为无超时
    UPLOAD_TIME_OUT:0,
    // 错误处理
    FILE_EXTENSION_ERR:"不允许的文件名后缀:",
    FILE_SIZE_ERR:"超出允许的文件大小限制:",
    FILE_TYPE_ERR:"不允许的文件类型:",
    UPLOAD_FILE_ERR:"上传文件时出错",
    ERR_404:"未找到上传路径",
    NO_FILE_CAN_UPLAD_ERR:"没有符合上传条件的文件",
    UPLOAD_PROGRESS_ERR:"无法创建进度条",
    FILE_REPEAT_ERR:"同名文件",
  };

  /*
    @dec 组件入口
    @param element 传入一个dom对象或选择器
    @param options 传入功能选项
    @return 组件对象
  */
  function GkkUpload(element,options) {

    return GkkUpload.prototype.init(element,options);
  }

  function isFunction(o) {
    return typeof function(){} === typeof o;
  }

  function isString(o) {
    return typeof '1' === typeof o;
  }

  // http://stackoverflow.com/questions/4767709/checking-if-object-is-a-dom-element
  function isDOMElement(o) {
    // return typeof o === typeof document.documentElement;
    return o instanceof Element;
  }

  // http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
  // function uuid() {
  //   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
  //     var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
  //     return v.toString(16);
  //   });
  // }

  /*
  * @dec: 往class属性后面增加一个新class
  * @param:ele:domElement 要添加的元素
  * @param:clas:string 要添加的class,多个用空格分开
  */
  function addClass(ele,clas){
    var _class = ele.getAttribute('class');
    if(!_class) _class = '';
    if(!clas) throw new Error('clas is undefined');

    // class完全相同直接返回
    clas = clas.trim();
    _class = _class.trim();
    if(clas === _class) {
      return;
    }

    clas = clas.split(' ');
    _class = _class.split(' ');
    for (var i = 0,len = clas.length; i < clas.length; i+=1) {
      var index = _class.indexOf(clas[i]);
      // 过滤相同class
      if(index === -1) {
        _class.push(clas[i]);
      }
    }
    ele.setAttribute('class',_class.join(' '));
  }
  /*
  * @dec: 移除class
  * @param:ele:domElement 需要移除class的元素
  * @param:clas:string 要移除的class,多个用空格分开
  */
  function rmClass(ele,clas) {
    var
    _class = ele.getAttribute('class'),
    _c = clas.split(' ')
    // 属性为空直接返回
    if(!_c) return;
    if(!_class) return;

    _class = _class.split(' ');
    for (var i = 0; i < _c.length; i+=1) {
      var index = _class.indexOf(_c[i]);
      if(index > -1) {
        _class.splice(index,1);
      }
    }
    ele.setAttribute('class',_class.join(' '));
  }

  // http://stackoverflow.com/questions/2490825/how-to-trigger-event-in-javascript
  function triggerEvent(el, eventName, options) {
    var event;
    if (window.CustomEvent) {
      event = new CustomEvent(eventName, options);
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(eventName, true, true, options);
    }
    el.dispatchEvent(event);
  }

  // http://stackoverflow.com/questions/190852/how-can-i-get-file-extensions-with-javascript
  function getFileExtension(filename) {
    return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined;
  }
  // 显示文件大小
  function fileSizeTrans(size) {
    if(size > 1000 * 1000) {
      return parseInt(size/(1000 * 1000) * 10)/10 +' MB';
    } else if(size > 1000) {
      return parseInt(size/(1000) * 10) /10 +' KB';
    } else {
      return size + ' Bytes';
    }
  }

  // 获取dom元素
  function getDOMElementBySelector(selector) {
    if(document.querySelector) {
      return document.querySelector(selector);
    } else if(REGEX.TEST_ID.test(selector)) {
      return document.getElementById(selector);
    } else if(REGEX.TEST_ID.test(selector)) {
      return document.getElementByClassName(selector);
    } else {
      throw new Error(ERROR.SELECT_ELEMENT_ERROR);
    }
  }
  // http://www.html5rocks.com/en/tutorials/cors/
  function createCORSRequest(method,url,async) {
    var xhr = new XMLHttpRequest();
     if ("withCredentials" in xhr) {
       // XHR for Chrome/Firefox/Opera/Safari.
       xhr.open(method, url, async);
     } else if (typeof XDomainRequest != "undefined") {
       // XDomainRequest for IE.
       xhr = new XDomainRequest();
       xhr.open(method, url, async);
     } else {
       // CORS not supported.
       xhr = null;
     }
     return xhr;
  }

  function cDiv(div){
    var o = document.createElement('div');
    if(div.id) {
      o.id = div.id;
    }
    if(div.class) {
      addClass(o,div.class);
    }
    return o;
  }

  function cText(text){
    return document.createTextNode(text);
  }

  GkkUpload.prototype = {
    init:function(element,options){
      // 获取容器元素
      if(isDOMElement(element)) {
        this.container = element;
      } else if(isString(element)) {
        this.container = getDOMElementBySelector(element);
      }
      if(this.container === '' || this.container === undefined) {
        throw new Error(ERROR.INIT_CONTAINER_ERROR);
      }

      // 初始化选项
      this.options = {};
      if(options === undefined) {
        this.options = DEFAULT_OPTIONS;
      } else {
        for (var proto in DEFAULT_OPTIONS) {
          if (options.hasOwnProperty(proto)) {
            this.options[proto] = options[proto];
          }  else {
            this.options[proto] = DEFAULT_OPTIONS[proto];
          }
        }
      }

      // 保存输入的文件
      this.files = [];
      // 是否准备上传
      this.readytoup = false;
      // 在同回上传中上一次的文件数量
      this.last_files_length = 0;
      // 在同回上传中已经上传
      this.uploaded_file_length = 0;
      // 允许上传的文件
      this.ready_files = [];

      return this.setup();
    },

    // 构建所有元素
    setup:function(){
      this
      .setupRoot()
      .setupForm()
      .setupUploadButton()
      .setupCancleUploadButton()
      .setupInput()
      .setupFileInfoBox()
      .setupReturnButton()
      .setupPopup()
      .render();

      return this.bind();
    },

    // 绑定事件
    bind:function(){
      // 将所有的handler都bind到this
      for (var handler in this) {
        if(REGEX.TEST_HANDLER.test(handler)) {
          this[handler] = this[handler].bind(this);
        }
      }

      this
      .bindDrag()
      .bindSelectFile()
      .bindCancleUploadButton()
      .bindUploadButton()
      .bindReturnButton()
      .bindInputChange();

      return this;
    },
    // 将更节点放入容器
    render:function(){
      this.container.appendChild(this.root);
      return this;
    },

    // 绑定器
    // http://stackoverflow.com/questions/9462605/how-to-bind-event-to-element
    on:function(element,type,handler){
      var _on = function(element,type,handler) {
        if(element.addEventListener) {
          element.addEventListener(type,handler,false);
        } else if(element.attachEvent) {
          element.attachEvent('on'+type,handler);
        } else {
          element['on'+type] = handler;
        }
      };
      // 绑定多个事件
      var _type = type.split(' ');
      for (var i = 0,len = _type.length; i < len; i+=1) {
        _on(element,_type[i],handler)
      }

      return this;
    },
    // 构建根节点
    setupRoot:function(){
      this.root = cDiv({class:this.options.GKK_UPLOAD_CLASS});
      return this;
    },
    // 构建表单
    setupForm:function(){
      var
      form = document.createElement('form'),
      text = document.createElement('div'),

      p1 = document.createElement('p'),
      p2 = document.createElement('p'),

      t1 = document.createTextNode(this.options.DRAG_TEXt),
      t2 = document.createTextNode(this.options.SELECT_TEXT),
      // 设置form属性
      attr = {
        'class':this.options.FORM_CLASS,
        'method':'post',
        'enctype':'multipart/form-data',
        'multiple':true,
      };
      for (var pro in attr) {
        form.setAttribute(pro,attr[pro]);
      }

      p1.appendChild(t1);
      p2.appendChild(t2);
      // 如果允许拖拽则显示提示
      if(this.options.ALLOW_DRAG) {
        text.appendChild(p1);
      }
      text.appendChild(p2);
      form.appendChild(text);
      this.root.appendChild(form);
      addClass(p1,this.options.FORM_P1_CLASS);
      addClass(p2,this.options.FORM_P2_CLASS);
      addClass(text,this.options.FORM_TEXT_CLASS);

      this.form = {
        form:form,
        selectFile:p2,
        text:text
      };

      return this;
    },

    setupInput:function() {
      var
      input = document.createElement('input');
      input.type = 'file';

      // 把input隐藏
      input.style.position = 'fixed';
      input.style.top = '-100px';
      input.multiple = true;
      this.root.appendChild(input);
      this.input = input;

      return this;
    },
    // 构建上传摁钮
    setupUploadButton:function() {
      var
      uploadButton = cDiv({class:this.options.UPLOAD_BUTTON_CLASS}),
      button_text  = cText(this.options.UPLOAD_TEXT);

      uploadButton.appendChild(button_text);
      this.root.appendChild(uploadButton);
      this.uploadButton = uploadButton;

      return this;
    },
    // 构建取消上传摁钮
    setupCancleUploadButton:function(){
      var
      cancleUploadButton = cDiv({class:this.options.CANCLE_UPLOAD_BUTTON_CLASS}),
      button_text = cText(this.options.CANCEL_UPLOAD_TEXT);
      cancleUploadButton.appendChild(button_text);
      this.root.appendChild(cancleUploadButton);
      this.cancleUploadButton = cancleUploadButton;
      return this;
    },
    // 构建文件信息
    setupFileInfoBox:function(){
      var
      fileInfoBox = cDiv({class:this.options.FILE_INFO_BOX_CLASS});

      this.form.form.appendChild(fileInfoBox);
      this.fileInfoBox = fileInfoBox;
      return this;
    },
    // 弹窗
    setupPopup:function(){
      this.popup = cDiv({class:this.options.POPUP_CLASS});
      this.root.appendChild(this.popup);
      return this;
    },
    // 创建弹窗元素
    createPopupItem:function(file,errText){
      var
      item = cDiv({class:this.options.POPUP_ITEM_CLASS}),
      f    = document.createElement('p'),
      e    = document.createElement('p'),
      t1   = cText('文件:'+ file.name),
      t2   = cText(errText);

      f.appendChild(t1);
      e.appendChild(t2);
      item.appendChild(f);
      item.appendChild(e);

      addClass(f,this.options.POPUP_ITEM_FILE_NAME_CLASS);
      addClass(e,this.options.POPUP_ITEM_ERR_CLASS);

      return item;
    },
    //
    setupReturnButton:function(){
      var
      returnButton = cDiv({class:this.options.RETURN_BUTTON_CLASS}),
      returnText   = cText(this.options.RETURN_BUTTON_TEXT);

      returnButton.appendChild(returnText);
      this.returnButton = returnButton;
      this.root.appendChild(returnButton);
      return this;
    },
    // 显示返回摁钮
    showReturnButton:function(){
      rmClass(this.returnButton,'hide');

      return this;
    },
    hideReturnButton:function(){
      addClass(this.returnButton,'hide');

      return this;
    },

    // 上传之前的设置
    _beforeUpload:function(cb) {
      this.showUploadingView();
      if(!isFunction(this.beforeUpload)) {
        return cb();
      } else {
        this.beforeUpload();
        setTimeout(function(){
          cb();
        },0);
      }
    },
    // 准备上传
    readyToUpload:function(){
      this.checkAndShowUploadFileInfo();
      this.readytoup = true;
      // 如果开启自动上传
      if(this.options.ALLOW_AUTO) {
        return this.upload();
      }
      this.showUploadButton();
    },
    /*
    * 检查，并构建文件信息的元素
    */
    checkAndShowUploadFileInfo:function(){
      var
      fileLines = [],
      fileList,

      // 用于保存出错文件信息
      notallowtype = [],
      notallowextension = [],
      oversize = [];

      var
      // 防止连续拖拽文件时dom覆盖加载，仅仅创建新增文件的元素
      i = this.last_files_length,
      len = this.files.length;

      // 这里检测文件并创建显示文件的容器容器
      for (; i < len; i+=1) {
        var file = this.files[i];
        // var name = file.name,type = file.type,size = file.size;

        var error = false;
        if(!this.checkAllowFileSize(file)) {
          error = true;
        }
        if(!this.checkAllowFileExtension(file)) {
          error = true;
        }
        if(!this.checkAllowFileType(file)) {
          error = true;
        }

        if(!error) {
          var file_line = this.createFileLine(file);
          file.fileLine = file_line;
          fileLines.push(file_line);
          this.ready_files.push(file);
        }
      }

      // 对不符合的文件提醒
      // if(notallowtype.length > 0) {
      //
      // }
      //
      // if(notallowextension.length > 0){
      //
      // }
      //
      // if(oversize.length > 0){
      //
      // }

      // 没有上传条件的文件
      // 且当前未有文件上传
      if(fileLines.length < 1 && this.uploaded_file_length < 1) {
        this.cancleReadyUpload();
        throw new Error(this.options.NO_FILE_CAN_UPLAD_ERR);
      }

      // 保存上次上次文件列表长度
      this.last_files_length = len;
      fileList = this.createFileList(fileLines);
      this.fileInfoBox.appendChild(fileList);
    },

    cancleReadyUpload:function() {
      this.readytoup = false;
      this.files = [];
      this.ready_files = [];
      this.showWaitToUploadView();
    },

    upload:function() {
      var
      self = this,
      // 防止连续拖拽导致重复上传
      i = this.uploaded_file_length,
      // 这里取出可以上传的文件长度
      len = this.ready_files.length;

      // 先运行beforeUpload
      this._beforeUpload(function(){
        // 同时上传
        if(self.options.ALLOW_SIMULTANEOUSLY) {
          for (; i < len; i++) {
            self.ajax({
              file:self.ready_files[i],
              complete:function(){},
              success:function(data){
                console.log(data);
              }
            })
          }
        } else {
          // 一个一个传
          var _upload = function(_file){
            slef.ajax({
              data:_file,
              success:function(data){
                console.log(data);
              },
              complete:function(){
                if(i < len) {
                  _upload(self.ready_files[i])
                  i += 1;
                }
              },
            })
          };
        }
      })
    },
    // 恩。目前并没有用到。
    uploadComplete:function(){

    },
    allUploadComplete:function(cb) {
      if(isFunction(cb)){
        cb();
      }
    },

    uploadError:function(file) {
      this.fileUploadFail(file);
    },

    uploadSuccess:function(success,file,json) {
      success(json);
      this.fileSaveSuccess(file);
    },
    /*
    * @dec: 创建文件信息行
    * @param: file 文件元素
    * @return: dom节点的集合
    */
    createFileLine:function(file){
      var
      fileLine = cDiv({class:this.options.FILE_LINE_CLASS}),
      fileName = cDiv({class:this.options.FILE_NAME_CLASS}),
      fileSize = cDiv({class:this.options.FILE_SIZE_CLASS}),
      fileType = cDiv({class:this.options.FILE_TYPE_CLASS}),
      fileUploadProgress = cDiv({class:this.options.FILE_UPLOAD_PROGRESS_CLASS}),
      fileUploadPrpgressValue = cDiv({class:this.options.FILE_UPLOAD_PROGRESS_VALUE_CLASS}),
      fileUploadPrpgressValueNumber = cDiv({class:this.options.FILE_UPLOAD_PROGRESS_VALUE_NUMBER_CLASS}),
      // 文本
      fnm = cText(this.options.FILE_NAME_TEXT+'  '+file.name),
      fsz = cText(this.options.FILE_SIZE_TEXT+' '+fileSizeTrans(file.size)),
      fty = cText(this.options.FILE_TYPE_TEXT+' '+file.type);
      pv  = cText('0%');

      fileUploadPrpgressValueNumber.appendChild(pv);
      fileUploadProgress.appendChild(fileUploadPrpgressValue);
      fileUploadProgress.appendChild(fileUploadPrpgressValueNumber);

      fileLine.appendChild(fileName);fileLine.appendChild(fileSize);fileLine.appendChild(fileType);
      fileName.appendChild(fnm); fileType.appendChild(fty); fileSize.appendChild(fsz);

      if(this.options.ALLOW_UPLOAD_PROGRESS) {
        fileLine.appendChild(fileUploadProgress);
      }

      return {
        fileLine:fileLine,
        fileName:fileName,
        fileSize:fileSize,
        fileType:fileType,
        fileUploadProgress,fileUploadProgress,
        fileUploadPrpgressValue:fileUploadPrpgressValue,
        fileUploadPrpgressValueNumber:fileUploadPrpgressValueNumber,
        fileUploadPrpgressValueNumberText:pv,
      }
    },
    // 将文件信息的节点添加进list节点
    createFileList:function(fileLines){
      var
      fileList = cDiv({class:this.options.FILE_LIST_CLASS});
      for (var i = 0,len = fileLines.length; i < len; i+=1) {
        fileList.appendChild(fileLines[i].fileLine);
      }
      return fileList;
    },
    // 清除所有的 list节点
    removeFileList:function(){
        this.fileInfoBox.innerHTML = '';
    },
    /*
    * @dec 创建ajax对象
    * @param data{file} 传入的文件
    */
    ajax:function(data){
      var
      self = this,
      httpRequest = createCORSRequest('POST',this.options.UPLOAD_URL,this.options.ASYNC),
      formData = new FormData();

      if(!httpRequest) {
        throw new Error('无法创建http request！');
      }

      try {
        // 添加文件
        formData.append(this.options.FORM_UPLOAD_NAME || 'file',data.file);
        // 是否显示上传进度
        if(this.options.ALLOW_UPLOAD_PROGRESS) {
          if(httpRequest.upload) {
            // 监听进度
            httpRequest.upload.onprogress = function(e) {
              if(e.lengthComputable) {
                var complete = Math.floor((e.loaded / e.total) * 100).toString() + '%';
                self.progressHandler(data.file.fileLine,complete);
              }
            }
          } else {
            console.error(this.options.UPLOAD_PROGRESS_ERR);
          }
        }

        // 监听
        httpRequest.onreadystatechange = function() {
          if(httpRequest.readyState === XMLHttpRequest.DONE) {
            data.complete();
            //
            if(httpRequest.status === 200) {
              var json = JSON.parse(httpRequest.responseText);
              if(json.status === 'error') {
                return self.uploadError(data.file);
              } else if (json.status === 'success') {
                return self.uploadSuccess(data.success,data.file,json);
              }
            } else if(httpRequest === 404) {
              console.error(this.options.ERR_404);
            } else {
              self.uploadError(data.file);
            }
          }
        };

        if(this.options.ALLOW_CORS) {
          // 这里做跨域
          // 但是不做也能成。
        }
        httpRequest.send(formData);
        // 记录已经上传的文件数量
        this.uploaded_file_length += 1;
      } catch (e) {
        console.error(this.options.UPLOAD_FILE_ERR);
        self.uploadError(data.file);
      }
    },

    // 绑定拖拽
    bindDrag:function(){
      if(!this.options.ALLOW_DRAG) {
        return this;
      }

      this
      .on(this.form.form,'drag dragstart dragend dragover dragenter dragleave drop',this.dragStartHandler)
      .on(this.form.form,'dragstart dragover dragenter',this.dragOverHandler)
      .on(this.form.form,'dragleave dragexit dragend drop',this.dragStopHandler)
      .on(this.form.form,'drop',this.dropHandler);

      return this;
    },

    setFiles:function(files) {
      var filesname = '';

      // 防止同名文件重复
      for(var i = 0,len = this.files.length; i<len; i+=1) {
        filesname += this.files[i].name;
      }
      for (var i = 0,len = files.length; i < len; i+=1) {
        if(filesname.indexOf(files[i].name) > -1) {
          // 同一次上传出现出现同名文件
          console.error(this.options.FILE_REPEAT_ERR + ' ' + files[i].name);
        } else {
          this.files.push(files[i]);
        }
      }
    },

    dropHandler:function(e){
      this.setFiles(e.dataTransfer.files);
      this.readyToUpload();
    },

    dragStartHandler:function(e){
      e.preventDefault();
    },

    dragOverHandler:function(e){
      this.showDragOverView();
    },

    dragStopHandler:function(){
      var self = this;
      setTimeout(function () {
        self.toggleUploadView();
      }, 0);
    },

    toggleUploadView:function(){
      if(this.readytoup){
        this.showReadyToUploadView();
      } else {
        this.showWaitToUploadView();
      }
    },
    // 拖拽界面
    showDragOverView:function(){
      addClass(this.form.text,'hide');
      this.showDragOver();
    },
    // 准备上传界面
    showReadyToUploadView:function(){
      // this.showUploadButton();
      this.hideDragOver();
      addClass(this.form.text,'hide');
    },

    showUploadingView:function(){
      this.showReturnButton();
      this.hideUploadButonn();
    },

    showWaitToUploadView:function(){
      this.hideUploadButonn();
      this.hideDragOver();
      rmClass(this.form.text,'hide');
      this.removeFileList();
      this.hideReturnButton();
    },

    showFileInfoBoxOver:function() {
      addClass(this.fileInfoBox,this.options.FILE_INFO_BOX_OVER_CLASS);
    },

    hideFileInfoBoxOver:function() {
      rmClass(this.fileInfoBox,this.options.FILE_INFO_BOX_OVER_CLASS);
    },

    showDragOver:function(){
      addClass(this.root,this.options.OUTTER_DRAG_OVER_CLASS);
      addClass(this.form.form,this.options.FORM_DRAG_OVER_CLASS);
    },

    hideDragOver:function(){
      rmClass(this.root,this.options.OUTTER_DRAG_OVER_CLASS);
      rmClass(this.form.form,this.options.FORM_DRAG_OVER_CLASS);
    },

    hideUploadButonn:function(){
      addClass(this.uploadButton,'hide');
      addClass(this.cancleUploadButton,'hide');
    },

    showUploadButton:function(){
      rmClass(this.uploadButton,'hide');
      rmClass(this.cancleUploadButton,'hide');
    },

    bindSelectFile:function(){
      this.on(this.form.selectFile,'click',this.selectFileHandler)
      return this;
    },

    selectFileHandler:function(e){
      triggerEvent(this.input,'click');
    },

    bindInputChange:function(){
      this.on(this.input,'change',this.inputChangeHandler)
      return this;
    },

    inputChangeHandler:function(e){
      var self = this;
      this.setFiles(this.input.files);
      this.readyToUpload();
      //
      setTimeout(function () {
        self.toggleUploadView();
      }, 0);
    },

    bindUploadButton:function() {
      this.on(this.uploadButton,'click',this.uploadButtonHandler);
      return this;
    },

    uploadButtonHandler:function(){
      this.upload();
    },

    bindCancleUploadButton:function(){
      this.on(this.cancleUploadButton,'click',this.cancleUploadHandler);
      return this;
    },

    cancleUploadHandler:function(){
      this.readytoup = false;
      this.clearUploadInfo();
      this.showWaitToUploadView();
    },
    // 清除所有的上传信息
    clearUploadInfo:function(){
      // 清空文件和设置
      this.files = [];
      this.ready_files = [];
      this.last_files_length = 0;
      this.uploaded_file_length = 0;
    },
    // 显示文件的报错信息
    showPopup:function(file,err){
      var
      self = this,
      item = this.createPopupItem(file,err);
      this.popup.appendChild(item);

      if(this.options.POPUP_TIME_OUT !== 0) {

        setTimeout(function () {
          item.parentNode.removeChild(item);
        }, self.options.POPUP_TIME_OUT);
      }
    },
    // 检测文件信息
    checkAllowFileSize:function(file){
      var size = file.size;
      if(size < this.options.ALLOW_FILE_SIZE) {
        return true;
      } else {
        var err = this.options.FILE_SIZE_ERR + size + '(请上传小于:'+fileSizeTrans(this.options.ALLOW_FILE_SIZE)+'的文件)';
        this.showPopup(file,err);
        console.error(err);
        return false;
      }
    },

    checkAllowFileExtension:function(file) {
      var extension = getFileExtension(file.name);
      if(this.options.ALLOW_FILE_EXTENSION.join('').indexOf(extension) > -1) {
        return true;
      } else {
        var err = this.options.FILE_EXTENSION_ERR+extension + '(允许的文件后缀为' + this.options.ALLOW_FILE_EXTENSION.join(' ') + ')';
        this.showPopup(file,err);
        console.error(err);
        return false;
      }
    },

    checkAllowFileType:function(file){
      var type = file.type;
      if(this.options.ALLOW_FILE_TYPE.join('').indexOf(type.split('/')[0]) > -1) {
        return true;
      } else {
        var err = this.options.FILE_TYPE_ERR + type + '(允许的文件类型为' + this.options.ALLOW_FILE_TYPE.join(' ') + ')';
        this.showPopup(file,err);
        console.error(err);
        return false;
      }
    },

    progressHandler:function(fileLine,complete){
      fileLine.fileUploadPrpgressValueNumberText.nodeValue = complete;
      fileLine.fileUploadPrpgressValue.style.width = complete;
      if(complete === '100%') {
        this.fileUploadSuccess(fileLine);
      }
    },

    fileUploadFail:function(file){
      var self = this;
      setTimeout(function () {
        file.fileLine.fileUploadPrpgressValueNumberText.nodeValue = self.options.FILE_UPLOAD_VALUENUMBER_FAIL_TEXT;
        addClass(file.fileLine.fileUploadPrpgressValueNumber,self.options.FILE_UPLOAD_VALUENUMBER_FAIL_CLASS);
      }, 500);

      setTimeout(function(){
        addClass(file.fileLine.fileLine,self.options.FILE_UPLOAD_FAIL_CLASS);
      },1500);
    },

    fileUploadSuccess:function(fileLine) {
      var self = this;
      setTimeout(function () {
        fileLine.fileUploadPrpgressValueNumberText.nodeValue = self.options.FILE_UPLOAD_VALUENUMBER_SUCCESS_TEXT;
        addClass(fileLine.fileUploadPrpgressValueNumber,self.options.FILE_UPLOAD_VALUENUMBER_SUCCESS_CLASS);
      }, 500);

      setTimeout(function () {
        addClass(fileLine.fileLine,self.options.FILE_UPLOAD_SUCCESS_CLASS);
      }, 1500);
    },

    fileSaveSuccess:function(file){
      var self = this;
      setTimeout(function () {
        file.fileLine.fileUploadPrpgressValueNumberText.nodeValue = self.options.FILE_UPLOAD_SAVE_SUCCESS_TEXT;
      }, 1000);
    },

    bindReturnButton:function(){
      this.on(this.returnButton,'click',this.returnButtonHandler);

      return this;
    },

    returnButtonHandler:function(){
      this.clearUploadInfo();
      this.showWaitToUploadView();
    }

  };

  return GkkUpload;
})
