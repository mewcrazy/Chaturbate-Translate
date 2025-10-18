jQuery.ajaxSetup({async:false});

// Preload emojis
const emojis = getResource('json/native.json')
const iso639_langs = getResource('json/iso639-1.json')

/* A Google API Key (for the Cloud Translation API) is needed to get this script to work */
var googleApiKey = "AIzaSyA8m0bay1Sg545_mrZKkmEFIh5bJw7A4a8";
var prefTranslationLang = localStorage.getItem("prefTranslationLang")
var translationLanguages = []

/* html templates */
var htmlModelOverlay = getResource("html/modelinfo-overlay.html");
var htmlLangChooser = getResource("html/language-chooser.html");
var htmlAutoTipOverlay = getResource("html/overlay-auto-tip.html")
var htmlLangPicker = getResource("html/language-picker.html")
var htmlTranslateButton = '<span class="translate-line"><button class="a11y-button TranslateButton#ZN TranslateButton_outline#qg chat-message-translate-button" style="float: none; display: inline-block;" type="button"><svg style="height: 14px; width: 14px;" class="IconV2__icon#YR" viewBox="0 0 16 14"><path fill="currentColor" fill-rule="evenodd" d="M10.28 1.72V3h-1.5a18.53 18.53 0 0 1-2.6 4.52l.05.05c.43.46.86.93 1.3 1.38l-.9.9c-.37-.36-.72-.74-1.07-1.13l-.2-.21c-.9.99-1.9 1.88-3 2.67l-.77-1.02.03-.02a17.36 17.36 0 0 0 2.87-2.58c-.52-.6-1.03-1.19-1.52-1.8L2.1 4.68l1-.8.86 1.08c.44.54.9 1.07 1.36 1.6C6.15 5.46 6.84 4.27 7.4 3H.68V1.72h4.48V.44h1.28v1.28h3.84Zm5.04 11.84h-1.38L13 11.32H9.48l-.93 2.24H7.17l3.32-8H12l3.33 8ZM11.24 7.1l-1.22 2.94h2.45L11.24 7.1Z" clip-rule="evenodd"></path></svg></button></span>'
var htmlEnhancedOptions = chrome.runtime.getURL('html/enhanced-options.html')


/**
 * Move Bottom Tabs to Top Tab Bar
 */
waitForKeyElements("#settings-tab-default", moveBottomTabs, false);
function moveBottomTabs(el) {

  // add tabnav items
  $(el).before('<div ts="bi" class="tab chatAreaTabColor chat-tab-handle goto-custom-tab" data-tab="bio" id="bio-tab-default" data-paction-name="BIO" style="position: static; padding: 3px 8px; margin: 2px 2px 0px; border-radius: 4px 4px 0px 0px; min-width: 16px; width: auto; height: 100%; font-size: 12px; cursor: pointer; float: left; text-size-adjust: none; user-select: none; line-height: 1.2; display: inline-block;"><span><span data-paction-name="BIO" style="vertical-align: top;">BIO</span></span></div>')
  //$(el).before('<div ts="pv" class="tab chatAreaTabColor chat-tab-handle goto-custom-tab" data-tab="more" id="pics-tab-default" data-paction-name="PICS & VIDEOS" style="position: static; padding: 3px 8px; margin: 2px 2px 0px; border-radius: 4px 4px 0px 0px; min-width: 16px; width: auto; height: 100%; font-size: 12px; cursor: pointer; float: left; text-size-adjust: none; user-select: none; line-height: 1.2; display: inline-block;"><span><span data-paction-name="PICS & VIDEOS" style="vertical-align: top;">Pics & Videos</span></span></div>')
  //$(el).before('<div ts="mo" class="tab chatAreaTabColor chat-tab-handle goto-custom-tab" data-tab="pics" id="more-tab-default" data-paction-name="MORE" style="position: static; padding: 3px 8px; margin: 2px 2px 0px; border-radius: 4px 4px 0px 0px; min-width: 16px; width: auto; height: 100%; font-size: 12px; cursor: pointer; float: left; text-size-adjust: none; user-select: none; line-height: 1.2; display: inline-block;"><span><span data-paction-name="MORE" style="vertical-align: top;">More</span></span></div>')
  //$(el).before('<div ts="sh" class="tab chatAreaTabColor chat-tab-handle goto-custom-tab" data-tab="share" id="share-tab-default" data-paction-name="SHARE" style="position: static; padding: 3px 8px; margin: 2px 2px 0px; border-radius: 4px 4px 0px 0px; min-width: 16px; width: auto; height: 100%; font-size: 12px; cursor: pointer; float: left; text-size-adjust: none; user-select: none; line-height: 1.2; display: inline-block;"><span><span data-paction-name="SHARE" style="vertical-align: top;">Share</span></span></div>')

  // add tabs
  $('#ChatTabContainer #tab-row + .window').append('<div class="se-tab se-tab-bio" data-tab="bio" ts="bi" style="height: 100%; width: 100%; position: relative; overflow: hidden; -webkit-tap-highlight-color: transparent; display: block;"><div style="display: flex; flex-direction: column; height: 100%;"><div ts="D" style="width: 100%; position: static; overflow: auto scroll; -webkit-tap-highlight-color: transparent; box-sizing: border-box; padding: 11px; font-size: 12px; flex: 1 1 0%; margin: 0px;">Bio</div></div></div>')
  //$('#ChatTabContainer #tab-row + .window').append('<div class="se-tab se-tab-pics" data-tab="more" ts="bi" style="height: 100%; width: 100%; position: relative; overflow: hidden; -webkit-tap-highlight-color: transparent; display: block;"><div style="display: flex; flex-direction: column; height: 100%;"><div ts="D" style="width: 100%; position: static; overflow: auto scroll; -webkit-tap-highlight-color: transparent; box-sizing: border-box; padding: 11px; font-size: 12px; flex: 1 1 0%; margin: 0px;">Pics</div></div></div>')
  //$('#ChatTabContainer #tab-row + .window').append('<div class="se-tab se-tab-more" data-tab="pics" ts="bi" style="height: 100%; width: 100%; position: relative; overflow: hidden; -webkit-tap-highlight-color: transparent; display: block;"><div style="display: flex; flex-direction: column; height: 100%;"><div ts="D" style="width: 100%; position: static; overflow: auto scroll; -webkit-tap-highlight-color: transparent; box-sizing: border-box; padding: 11px; font-size: 12px; flex: 1 1 0%; margin: 0px;">More</div></div></div>')
  //$('#ChatTabContainer #tab-row + .window').append('<div class="se-tab se-tab-share" data-tab="share" ts="bi" style="height: 100%; width: 100%; position: relative; overflow: hidden; -webkit-tap-highlight-color: transparent; display: block;"><div style="display: flex; flex-direction: column; height: 100%;"><div ts="D" style="width: 100%; position: static; overflow: auto scroll; -webkit-tap-highlight-color: transparent; box-sizing: border-box; padding: 11px; font-size: 12px; flex: 1 1 0%; margin: 0px;">Share</div></div></div>')

  $('.se-tab-bio>div>div').html($('#BioContents').html())
  //$('.se-tab-pics>div>div').html($('#PhotoVideos').html())
  //$('.se-tab-more>div>div').html($('#MoreRooms').html())
  //$('.se-tab-share>div>div').html($('#shareTab').html())

  // regular tabs
  $('.chat-tab-handle:not(.goto-custom-tab,.active)').on('click', function(e) {
    $('#ChatTabContainer #tab-row>*').removeClass('active')
    $(this).addClass('active')
    $('.se-tab').hide()
    $('#ChatTabContainer #tab-row+.window>*').eq(($(this).index() >= 2 ? $(this).index()-1 : $(this).index())).show()
  })

  // custom tabs
  $('.goto-custom-tab').on('click', function(e) {
    e.preventDefault
    e.stopImmediatePropagation
    e.stopPropagation
    $('#ChatTabContainer #tab-row>*').removeClass('active')
    $('#ChatTabContainer #tab-row+.window>*').hide()
    $(this).addClass('active')
    $('.window [data-tab="'+$(this).attr('data-tab')+'"]').show()
  })
}


/**
 * Save Player Volume
 */
waitForKeyElements("#TheaterModePlayer .vjs-tech", savePlayerVolume, false);
function savePlayerVolume(player) {

  if(localStorage.getItem("SE_playerVolume")) {
    $(player).get(0).volume = localStorage.getItem("SE_playerVolume")
  }

  $(player).on('volumechange', function(e) {
    localStorage.setItem("SE_playerVolume", $(player).get(0).volume)
  })
}


/**
 * Hide Auto Refill Feature
 */
waitForKeyElements('form[data-testid="settings-tab-form"]', hideAutoRefillFeature);
function hideAutoRefillFeature() {
  processOption("SE_optionDisableAutoRefill")
}


/**
 * Add global options flyout & Output website time in header
 */
waitForKeyElements(".broadcast-yourself", addOptionsMenu);
function addOptionsMenu(el) {

  // Add global options flyout
  if(!$(el).closest('ul').find('.open-enhanced-options').length) {

    // add button
    $(el).after('<button class="open-enhanced-options" type="button"><span><svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style="height: 1.2em;"><path d="M14.9474 6.50932L14.1034 6.20998C13.9826 6.16702 13.8721 6.09916 13.7791 6.01078C13.6862 5.92241 13.6128 5.8155 13.5638 5.69697C13.5148 5.57845 13.4912 5.45094 13.4946 5.32272C13.498 5.19451 13.5282 5.06843 13.5834 4.95265L13.9674 4.14398C14.1075 3.84868 14.1528 3.51727 14.0971 3.19521C14.0414 2.87315 13.8874 2.57621 13.6563 2.3451C13.4252 2.11398 13.1283 1.96002 12.8062 1.90432C12.4842 1.84862 12.1528 1.89391 11.8574 2.03398L11.0488 2.41865C10.9329 2.47361 10.8069 2.50365 10.6787 2.50683C10.5505 2.51002 10.4231 2.48628 10.3046 2.43715C10.1862 2.38802 10.0794 2.31458 9.99111 2.2216C9.90283 2.12861 9.83504 2.01814 9.79211 1.89732L9.49211 1.05398C9.38235 0.746123 9.18003 0.479756 8.91292 0.291408C8.6458 0.103059 8.32696 0.00195313 8.00011 0.00195312C7.67327 0.00195312 7.35443 0.103059 7.08731 0.291408C6.82019 0.479756 6.61788 0.746123 6.50811 1.05398L6.20811 1.89798C6.16512 2.01875 6.09728 2.12915 6.00897 2.22206C5.92066 2.31498 5.81384 2.38834 5.69541 2.4374C5.57699 2.48647 5.44959 2.51015 5.32144 2.50692C5.19329 2.50369 5.06725 2.47362 4.95145 2.41865L4.14278 2.03398C3.84747 1.89391 3.51607 1.84862 3.19401 1.90432C2.87195 1.96002 2.575 2.11398 2.34389 2.3451C2.11278 2.57621 1.95882 2.87315 1.90312 3.19521C1.84742 3.51727 1.89271 3.84868 2.03278 4.14398L2.41678 4.95265C2.47188 5.06844 2.50207 5.19451 2.5054 5.3227C2.50873 5.45089 2.48513 5.57835 2.43613 5.69685C2.38712 5.81535 2.31379 5.92224 2.22089 6.01063C2.12799 6.09902 2.01757 6.16693 1.89678 6.20998L1.05278 6.50998C0.744848 6.61958 0.478381 6.8218 0.289952 7.08887C0.101523 7.35595 0.000366211 7.6748 0.000366211 8.00165C0.000366211 8.32851 0.101523 8.64735 0.289952 8.91443C0.478381 9.1815 0.744848 9.38372 1.05278 9.49332L1.89678 9.79332C2.01755 9.83629 2.12795 9.90414 2.22085 9.99246C2.31375 10.0808 2.38708 10.1876 2.43609 10.3061C2.4851 10.4245 2.50871 10.5519 2.50538 10.6801C2.50206 10.8082 2.47187 10.9342 2.41678 11.05L2.03278 11.8587C1.89271 12.154 1.84742 12.4854 1.90312 12.8074C1.95882 13.1295 2.11278 13.4264 2.34389 13.6575C2.575 13.8887 2.87195 14.0426 3.19401 14.0983C3.51607 14.154 3.84747 14.1087 4.14278 13.9687L4.95145 13.5847C5.06722 13.5295 5.19329 13.4992 5.3215 13.4959C5.44971 13.4926 5.57718 13.5162 5.69566 13.5653C5.81415 13.6144 5.92099 13.6878 6.00927 13.7809C6.09755 13.8739 6.1653 13.9844 6.20811 14.1053L6.50811 14.9487C6.61788 15.2565 6.82019 15.5229 7.08731 15.7112C7.35443 15.8996 7.67327 16.0007 8.00011 16.0007C8.32696 16.0007 8.6458 15.8996 8.91292 15.7112C9.18003 15.5229 9.38235 15.2565 9.49211 14.9487L9.79211 14.1047C9.83509 13.9839 9.90293 13.8735 9.99126 13.7806C10.0796 13.6877 10.1864 13.6144 10.3049 13.5653C10.4233 13.5163 10.5507 13.4927 10.6789 13.496C10.807 13.4994 10.933 13.5296 11.0488 13.5847L11.8574 13.9687C12.1528 14.1087 12.4842 14.154 12.8062 14.0983C13.1283 14.0426 13.4252 13.8887 13.6563 13.6575C13.8874 13.4264 14.0414 13.1295 14.0971 12.8074C14.1528 12.4854 14.1075 12.154 13.9674 11.8587L13.5834 11.05C13.5284 10.9342 13.4982 10.8082 13.4948 10.6801C13.4915 10.5519 13.5151 10.4245 13.5641 10.3061C13.6131 10.1876 13.6865 10.0808 13.7794 9.99246C13.8723 9.90414 13.9827 9.83629 14.1034 9.79332L14.9474 9.49265C15.2554 9.38305 15.5218 9.18084 15.7103 8.91376C15.8987 8.64669 15.9999 8.32784 15.9999 8.00098C15.9999 7.67413 15.8987 7.35528 15.7103 7.08821C15.5218 6.82113 15.2554 6.61892 14.9474 6.50932ZM8.00011 11.1907C7.37045 11.1815 6.75667 10.9917 6.2318 10.6437C5.70693 10.2958 5.29306 9.80438 5.03945 9.22798C4.71516 8.44275 4.71553 7.56095 5.04046 6.77598C5.3654 5.99102 5.98838 5.36695 6.77278 5.04065C7.55892 4.72626 8.43681 4.73154 9.21911 5.05537C10.0014 5.3792 10.6262 5.99594 10.9601 6.77398C11.2844 7.55922 11.284 8.44102 10.9591 9.22598C10.6342 10.011 10.0112 10.635 9.22678 10.9613C8.83799 11.1212 8.42042 11.1993 8.00011 11.1907Z"></path></svg></span></button>')

    // html options overlay
    $('body').append('<div class="blurred-login-overlay se-blurred-login-overlay hidden" style="position: fixed; display: block; inset: 0px; z-index: 1100; visibility: visible;"></div><div class="enhanced-options-modal hidden"></div>')
    $('.enhanced-options-modal').load(htmlEnhancedOptions);

    // process options
    processOptions()
  }

  // open options menu
  $('.open-enhanced-options').on('click', (e) => {
    $('.enhanced-options-modal,.se-blurred-login-overlay').toggleClass('hidden')
  })

  // close options menu
  $('.enhanced-options-modal').on('click', '.enhanced-options-close', (e) => {
    $('.enhanced-options-modal,.se-blurred-login-overlay').toggleClass('hidden')
  })

  // close options menu when clicking on chaturbate's blurred overlay
  $('.se-blurred-login-overlay').on('click', (e) => {
    $('.enhanced-options-modal,.se-blurred-login-overlay').addClass('hidden')
  })

  // options change handler
  $('.enhanced-options-content').on('change', 'input[type="checkbox"]', function(e) {
    let name = $(this).attr('name')
    let val = ($(this).prop('checked') ? "1" : "0")
    localStorage.setItem("SE_"+name, val)
    processOption(name, val)
  })
}

function processOption(name, val) {

  switch(name) {
    case "SE_optionDisableAutoRefill":
      $('fieldset.auto-refill-fieldset').addClass('hidden')
      break;
    case "SE_optionEnableTranslations":
      break;
    default:
      // code block
  }
}

function processOptions() {

}


/**
 * Message templates
 */
waitForKeyElements('.theatermodeEmojiButtonChat', addMessageTemplates, false);
function addMessageTemplates(el) {

  if(!$('.se-message-templates-btn').length)
    $(el).before('<button class="se-message-templates-btn ChatInput__inputActionBtn#a_ ChatInput__smilesBtn#tx SmilesButton__btn#Dr" type="button" aria-label="Show smiles"><svg class="IconV2__icon#YR" fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 2.16 2.16" xml:space="preserve"><path d="M.836 2.048a.06.06 0 0 1-.06-.061l.006-.224H.631c-.114 0-.197-.094-.197-.21V.768c0-.113.082-.205.197-.205h1.204c.114 0 .22.092.22.205v.784c0 .116-.105.21-.22.21h-.582l-.382.274a.06.06 0 0 1-.035.012M.632.683C.583.683.555.72.555.768v.784c0 .049.029.09.077.09h.212a.06.06 0 0 1 .06.061L.9 1.867l.3-.215a.06.06 0 0 1 .035-.012h.602c.048 0 .1-.041.1-.09V.768c0-.048-.05-.085-.1-.085z"/><path d="M.201 1.264q-.019 0-.034-.015a.2.2 0 0 1-.062-.147V.318c0-.113.082-.205.197-.205h1.204c.114 0 .22.092.22.205v.035a.06.06 0 0 1-.12 0V.318c0-.048-.05-.085-.1-.085H.301C.252.233.224.27.224.318v.784c0 .023.003.042.021.058.025.022.024.06.002.084a.07.07 0 0 1-.048.02"/><path d="M1.023.952h-.24a.03.03 0 1 1 0-.06h.24a.03.03 0 1 1 0 .06m.421 0h-.3a.03.03 0 1 1 0-.06h.3a.03.03 0 1 1 0 .06m.24 0h-.12a.03.03 0 1 1 0-.06h.12a.03.03 0 1 1 0 .06m-.781.15h-.12a.03.03 0 1 1 0-.06h.12a.03.03 0 1 1 0 .06m.36 0h-.24a.03.03 0 1 1 0-.06h.24a.03.03 0 1 1 0 .06m.421 0h-.3a.03.03 0 1 1 0-.06h.3a.03.03 0 1 1 0 .06m-.6.181H.783a.03.03 0 1 1 0-.06h.3a.03.03 0 1 1 0 .06m.42 0h-.3a.03.03 0 1 1 0-.06h.3a.03.03 0 1 1 0 .06m.181 0h-.06a.03.03 0 1 1 0-.06h.06a.03.03 0 1 1 0 .06m-.781.149h-.12a.03.03 0 1 1 0-.06h.12a.03.03 0 1 1 0 .06m.331 0h-.21a.03.03 0 1 1 0-.06h.21a.03.03 0 1 1 0 .06"/></svg></button>')

  $('.se-message-templates-btn').off().on('click', function(e) {
    
    // append overlay
    $('.language-chooser').addClass('hidden')
    if($(this).closest('.ChatTabContents').find('.se-message-templates').length) {
      $('.se-message-templates').toggleClass('hidden')
    } else {
      $('.msg-list-wrapper-split').append('<div class="se-message-templates"><div class="title-block"><h3>Templates</h3><span class="se-add-message add-icon-wrapper"><svg class="icon icon-add"><use xlink:href="#icons-add"></use></svg></span><div class="add hidden"><input type="text" value="" placeholder="Your Text"></div><div class="search"><input class="inline-block input text-default theme-default se-msg-tpl-search" name="s" type="search" value="" placeholder="Search message templates ..."></div><button type="button" class="se-close-message-tpl SmilesWidgetContainer__closeBtn#GV" title="Close Languages"><svg style="height:20px;width:20px" class="IconV2__icon#YR" viewBox="0 0 24 24"><path fill="currentColor" d="M20.027 3.985a1.27 1.27 0 0 0-1.796 0L12 10.203l-6.23-6.23a1.27 1.27 0 0 0-1.797 0 1.27 1.27 0 0 0 0 1.796L10.203 12l-6.23 6.23a1.27 1.27 0 0 0 0 1.797c.497.497 1.3.497 1.796 0L12 13.797l6.23 6.23c.498.497 1.3.497 1.797 0s.497-1.3 0-1.796L13.797 12l6.23-6.23c.485-.485.485-1.3 0-1.785"/></svg></button></div><ul class="se-messages-tpl-list"></ul><span class="empty hidden">You haven\'t added any messages yet</span><span class="no-results hidden">No messages found.</span></div>')

      // fetch & insert templates
      let templates = [
        "Want to talk in their language? Try the Chaturbate Enhanced browser extension. See my bio.",
        "Lorem ipsum dolor amet Lorem ipsum dolor amet Lorem ipsum dolor amet2.",
        "Lorem ipsum dolor amet Lorem ipsum dolor amet Lorem ipsum dolor amet3.",
        "Lorem ipsum dolor amet Lorem ipsum dolor amet Lorem ipsum dolor amet4."
      ]
      if(templates) {
        $.each(templates, (k, v) => {
          $('.se-messages-tpl-list').append('<li class="se-message-tpl"><span>'+v+'</span></li>')
        })
        $('.empty').addClass('hidden')
      } else {
        $('.empty').removeClass('hidden')
      }

      // click message
      $('.se-add-message').off().on('click', function(e) {
        $(this).next('.add').removeClass("hidden")
      })

      // click message
      $('.se-messages-tpl-list span').on('click', function() {
        $('.se-custom-input').val('').focus()
        document.execCommand('insertText', false, $(this).text())
        $('.se-message-templates').toggleClass('hidden')
      })

      // close overlay
      $('.se-close-message-tpl').on('click', function() {
        $('.se-message-templates').toggleClass('hidden')
      })

      // search messages
      $(".se-msg-tpl-search").off().on("keyup", function() {
        var value = this.value.toLowerCase().trim();
        if(value.length) {
          let results = $(".se-message-tpl").show().filter(function() {
              return $(this).text().toLowerCase().indexOf(value) == -1;
          }).hide();
        } else {
          $(".se-message-tpl").show();
        }
      })
    }
  })

}


/**
 * Message Translation
 */
waitForKeyElements(".message-list", hideChatUsers, false);
function hideChatUsers(el) {
  let username = $('.user_information_header_username').text()
  let usernameModel = $('.activeRoom').text().split('\'')[0].toLowerCase()

  // observe messages div
  var observer = new MutationObserver(function(e) {

      // add translation button to regular messages
      $(el).find('[data-testid="chat-message"]:not(.se-processed)').slice(-50).each(function(index, item) {
        if(!$(this).find('.translate-line').length) {
          $(this).find('.msg-text').append(htmlTranslateButton)
          $(this).addClass("se-processed")
        }
      })

      // DND Mode (filter everything else)
      if(localStorage.getItem('SE_dndMode') === "1") {
        $(el).find('[data-testid="chat-message"]').slice(-50).each(function(index, item) {
          if(
            $(this).find('[data-testid="username"]').text() != username && $(this).find('[data-testid="username"]').text() != usernameModel
            && !$(this).find('.roomNotice.isTip,.roomNotice.titleChange,.roomNotice.bright-background').length
          )
            $(this).addClass("se-hidden")
        })
      } else {
        $(el).find('[data-testid="chat-message"].se-hidden').removeClass('se-hidden')
      }

      // auto translate
      if($('.switch-auto-translate input[type="checkbox"]').is(':checked')) {
        $(el).find('[data-testid="chat-message"]:not(.se-hidden):not(.se-translated)').slice(-1).each(function(index, item) {
          let that = $(this)
          let ell = $(this).find('.msg-text').clone()
          ell.find('.defaultUser').remove()
          let text = ell.text().trim()

          translateGoogle(text, 'en_US', $('.model-chat-content')).then(function(data) {
            if(!that.find('.msg-text').find('.translated-line').length) {
              that.find('.msg-text').find('.translate-line').before('<small class="translated-line">'+decodeHtml(data.data.translations[0].translatedText)+'</small>')
            }
          })

          $(this).addClass("se-translated")
        })
      }
  });
  observer.observe($('.message-list')[0], {characterData: true, childList: true, subtree: true});


  // translate button click handler
  $('.message-list').off().on('click', '.translate-line button', function(e) {
      let ell = $(this).closest('.msg-text').clone()
      ell.find('.defaultUser').remove()
      let text = ell.text().trim()
      let that = $(this)
      $(this).prop('disabled', true)

      translateGoogle(text, 'en_US', $('.model-chat-content')).then(function(data) {
        if(!that.closest('.msg-text').find('.translated-line').length) {
            that.closest('.translate-line').before('<small class="translated-line">'+decodeHtml(data.data.translations[0].translatedText)+'</small>')
        }
        $(this).prop('disabled', false)
      })
  })
}


/**
 * Private Messages Translations
 */ 
waitForKeyElements(".dmWindowInput", addLangDropdownPrivateChats, false);
function addLangDropdownPrivateChats(el) {
  let dm = $(el).closest('.dmWindow')
  let dmSubmit = $(el).find('.sendButton')
  let dmInputDiv = $(el)
  let dmInput = $(el).find('textarea')

  // add language dropdown
  if(!dm.find('.language-picker').length) {
    dmInputDiv.prepend(htmlLangPicker);

    // preselect if choosen before
    if(prefTranslationLang) {
      setTimeout(function() {
        dmInputDiv.find('.se-langpicker').attr('data-active', prefTranslationLang)
        dmInputDiv.find('.se-langpicker').prepend('<svg class="flag flag-'+prefTranslationLang+'"><use xlink:href="#'+prefTranslationLang+'"></use></svg>')
      }, 500);
    }
  }

  // reset language on right click
  dmInputDiv.find(".se-langpicker,.se-langpicker > .flag").on("contextmenu", function() { return false; });
  dmInputDiv.find('.se-langpicker').on('mousedown', function(e) {
      if( e.button == 2 ) {
        dmInputDiv.find('.se-langpicker').find('.flag,use').remove()
        $('.language-chooser .flag').removeClass('active')
        dmInputDiv.find('.se-langpicker').attr('data-active', '')
        localStorage.setItem('prefTranslationLang', "")
        return false;
      }
      return true;
  })
  
  // add own keypress event
  dmInput.off().on('keydown', function(e) {
    if(e.which == 13) {
      e.preventDefault()
      e.stopImmediatePropagation()
      e.stopPropagation()

      dm.find('.language-chooser').addClass("hidden")
      if(dm.find('.se-langpicker').attr('data-active')) {
          let lang = dm.find('.se-langpicker').attr('data-active').toLowerCase()
          dmInputDiv.append('<span class="se-loader-line"></span>') // TODO please as before

          console.log($(this).val(), $(this).text(), lang)
          console.log(dm.find('textarea').val(), dm.find('textarea').text(), lang)

          translateGoogle($(this).val(), lang, dm.find('.content-messages')).then((data) => {
            alert("ok translated")
              // TODO: console.log missing/wrong languages
              $(this).val('')
              $('.messenger-chat .se-loader-line').remove()
              $(this).focus()
              document.execCommand('insertText', false, decodeHtml(data.data.translations[0].translatedText))
              dmSubmit.click()
          });
      } else {
          // no translation needed
          dmSubmit.click()
      }
    }
  })

  // open language picker click handler
  $(el).on('click', '.se-langpicker', function(e) {

      if(!dm.find('.language-chooser').length) {

        // add language picker overlay
        $(el).prev().append(htmlLangChooser);

        // add all languages
        populateLanguageDropdowns()

        setTimeout(() => { $('.flag[data-lang="'+prefTranslationLang+'"]').addClass("active") }, 300);
      } else {
        dm.find('.language-chooser').toggleClass("hidden")
      }
  })

    // select/switch language
    dm.on('click', 'button.flag', function(e) {

      dm.find('.se-langpicker .flag').remove()
      if($(this).hasClass('active')) {
          $(this).removeClass('active')
          dm.find('.se-langpicker').attr('data-active', '')
          localStorage.setItem('prefTranslationLang', "")
      } else {
          dm.find('.se-langpicker').prepend($(this).html())
          dm.find('.language-chooser .flag.active').removeClass('active')
          $(this).addClass('active')
          dm.find('.se-langpicker').attr('data-active', $(this).attr('data-lang'))
          localStorage.setItem('prefTranslationLang', $(this).attr('data-lang'))
          dm.find('.language-chooser').addClass("hidden")
      }
    })

    // search language by html attributes
    dm.on("keyup", ".language-search", function() {
      var value = this.value.toLowerCase().trim();
      if(value.length) {
        $(".language-list button").show().filter(function() {
            return $(this).attr("data-search").toLowerCase().trim().indexOf(value) == -1;
        }).hide();
      } else {
        $(".language-list button").show();
      }
    });

    // clear search input
    dm.on('search', '.language-search', function() {
      if(this.value === "") {
        dm.find(".language-list button").show()
      }
    });

    // close language chooser
    dm.on('click', '.close-language-chooser', function(e) {
      dm.find('.language-chooser').toggleClass("hidden")
    })
}

/**
 * Lifecycle: Player started
 */
waitForKeyElements('.vjs-has-started', showTakeScreenshotButton);
function showTakeScreenshotButton(el) {
  $('.se-take-screenshot').removeClass('hidden') // "Take Screenshot" Button
  $('.se-pip').removeClass('hidden') // "Picture in Picture" Button
}


/**
 * Take Screenshot
 */
waitForKeyElements('#satisfactionScore', addTakeScreenshot);
function addTakeScreenshot(el) {
  $(el).after('<div ts="N" class="se-take-screenshot sendTipButton hidden" data-testid="follow-button" style="height: 15px; width: auto; position: relative; overflow: hidden; -webkit-tap-highlight-color: transparent; display: inline; font-family: UbuntuMedium, Helvetica, Arial, sans-serif; font-size: 12px; padding: 3px 8px 2px; top: -4px; float: right; border-radius: 3px; cursor: pointer; margin-right: 5px; line-height: 1.4;"><span></span><span>SCREENSHOT</span></div>');

  $('.se-take-screenshot').on('click', function(e) {
    e.preventDefault();

    let vid = $(".videoPlayerDiv video")
    if(vid.length === 0) return
    let canvas = document.createElement("canvas");
    canvas.width = vid[0].videoWidth;
    canvas.height = vid[0].videoHeight;
    canvas.getContext("2d").drawImage(vid[0], 0, 0, vid[0].videoWidth, vid[0].videoHeight);
    if(!canvas) return
    let username = $('.activeRoom').text().split("'")[0].toLowerCase()
    let link = document.createElement('a')
    link.download = genFilename(username, '.png', new Date())
    link.href = canvas.toDataURL()
    link.click()
  })
  function genFilename(fname, ext, date) {
    let d = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
    let t = ('0' + date.getHours()).slice(-2) + '-' + ('0' + date.getMinutes()).slice(-2) + '-' + ('0' + date.getSeconds()).slice(-2);
    return fname + '__' + d + '_' + t + ext;
  }
}

/**
 * Remove Ads & Accept Terms
 */
document.cookie = 'noads=1; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/';
document.cookie = 'agreeterms=1; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/';
document.cookie = 'fromaffiliate=1; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/';
document.cookie = 'affkey="eJxtkE0OwiAQha9C2MymTVraGsPexGtUCkYtkQDGNE3vLo9I6sIV37z5ecysPHLJ+LV3mleMK+sQnu8n+0Yc/QPxpM34miMUjxgwGgO04xx10P7yXBbIuV+Awm0qtRlEI4a6ber2wEQnh072x2y5lwWvCpr8rZWSC0lGvy5UMZog/hmIXPJFFugLpMkFXQKR3rQapO9qyKi9MQJwlKxb9FA+Cm18+wBS3UxH"; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/';
document.cookie = 'noads=1; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; domain=.chaturbate.com';
document.cookie = 'agreeterms=1; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; domain=.chaturbate.com';
document.cookie = 'fromaffiliate=1; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; domain=.chaturbate.com';
document.cookie = 'affkey="eJxtkE0OwiAQha9C2MymTVraGsPexGtUCkYtkQDGNE3vLo9I6sIV37z5ecysPHLJ+LV3mleMK+sQnu8n+0Yc/QPxpM34miMUjxgwGgO04xx10P7yXBbIuV+Awm0qtRlEI4a6ber2wEQnh072x2y5lwWvCpr8rZWSC0lGvy5UMZog/hmIXPJFFugLpMkFXQKR3rQapO9qyKi9MQJwlKxb9FA+Cm18+wBS3UxH"; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; domain=.chaturbate.com';


/**
 * Do Not Disturb Mode
 */
waitForKeyElements('#tab-row', addDefaultEmojis);
function addDefaultEmojis(el) {

  // append dnd toggle
  $(el).append('<div class="se-switcher switch-dnd-mode"><span>DND Mode</span><div class="toggle"><input name="SE_dndMode" type="checkbox" id="mode-toggle" value="1" class="toggle__input"><label for="mode-toggle" class="toggle__label"></label></div></div>')
  if(localStorage.getItem('SE_dndMode') === "1") {
    $('.switch-dnd-mode .switcher').toggleClass("on")
    $('.switch-dnd-mode input[type="checkbox"]').prop('checked', true)
  }
}


/**
 *  Add Translation Button to Stream Description
 */
waitForKeyElements('#VideoPanel .RoomSubjectSpan', addTransButtonCamGroup, false);
function addTransButtonCamGroup(el) {

  if(!$(el).find('.translate-line').length) {
    $(el).append(htmlTranslateButton)
  }

  // add event click handler
  $(el).off().on('click', '.translate-line', function(e) {
      let text = $(this).closest('.RoomSubjectSpan').clone().text().trim()
      let that = $(this)
      $(this).prop('disabled', true)

      translateGoogle(text, 'en_US', $('.model-chat-content')).then(function(data) {
        if(!that.prev('.translated-line').length) {
            that.before('<small class="translated-line">'+decodeHtml(data.data.translations[0].translatedText)+'</small>')
        }
        $(this).prop('disabled', false)
      })
  })
}


/**
 * Picture in Picture
 */
waitForKeyElements(".theater-overlay", videoAddPip);
function videoAddPip(el) {

  // midclick fullscreen
  $('#TheaterModePlayer').on('mousedown', 'video,.vjs-tech', function(e) {
    if(e.which === 2) {
      e.preventDefault();
      toggleFullscreen(document.getElementsByClassName('vjs-tech')[0])
    }
  });
  $('#TheaterModePlayer').on('dblclick', 'video,.vjs-tech', function(e) {
    toggleFullscreen(document.getElementsByClassName('vjs-tech')[0])
  });

  // pip
  $(el).next().append('<div class="se-pip hover-btn drop-shadow-container hidden" aria-label="Theater Mode" data-listener-count-pointerenter="3" data-listener-count-pointerleave="3" ts="_" id="theater-mode-icon" data-listener-count-click="1" style="display: inline-flex; position: relative; align-items: center; justify-content: center; min-width: 32px; user-select: none; pointer-events: auto;"><svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-pip"><path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h13A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5zM1.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z" fill="#fff"/><path d="M8 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5z" fill="#fff"/></svg><div class="no-drop-shadow video-controls-tooltip" ts="N" style="position: absolute; display: block; opacity: 0; bottom: calc(100% + 5px); left: 50%; transform: translateX(-50%); border-radius: 4px; background-color: rgba(0, 0, 0, 0.92); padding: 8px 16px; text-align: center; font-size: 13px; color: rgb(255, 255, 255); width: max-content; max-width: 150px; transition: inherit; pointer-events: none; visibility: hidden;"><p style="display: inline;">Theater Mode</p></div></div>')
  $('.se-pip').on('click', function(e) {
    $(this).attr('disabled', true)
    openPip(document.getElementsByClassName('vjs-tech')[0])
    $(this).attr('disabled', false)
  });
}
function toggleFullscreen(elem) {

    if (document.fullscreenElement === elem) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
    } else {
      if (elem.requestFullscreen) {
          elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
          elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
      }
    }
}
function openPip(elem) {
  if (elem.requestPictureInPicture) {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture();
    } else {
      elem.requestPictureInPicture();
    }
  }
}


/**
 * Add language/translation dropdown to main chat
 */
waitForKeyElements(".chat-input-form", addLangDropdown, false);
function addLangDropdown(jNode) {
    let modelChat = $(jNode).closest('.ChatTabContents')
    let modelChatInput = $(jNode).find('.customInput.chat-input-field')
    let modelChatSubmit = $(jNode).closest('.inputDiv').find('.SendButton.chat')

    // add dropdown html
    if(!modelChat.find('.se-langpicker').length) {
        $(jNode).before(htmlLangPicker);
        
        // prepopulate
        populateLanguageDropdowns()

        // preselect if choosen before
        if(prefTranslationLang) {
          setTimeout(function() {
            $('.se-langpicker').attr('data-active', prefTranslationLang)
            $('.se-langpicker').prepend('<svg class="flag flag-'+prefTranslationLang+'"><use xlink:href="#'+prefTranslationLang+'"></use></svg>')
          }, 500);
        }
    }

    // create own input
    $(jNode).find('.chat-input-field').addClass('hidden')
    $(jNode).append('<input class="se-custom-input customInput chat-input-field" type="text" value="" style="background: none; color: #b3b3b3; height: 16px; width: 100%; position: relative; overflow: scroll hidden; -webkit-tap-highlight-color: transparent; outline: none; border: none; box-sizing: border-box; font-size: 12px; white-space: nowrap; user-select: text; font-family: Helvetica, Arial, sans-serif; line-height: 15px;">')

    // add own keypress event
    $('.se-custom-input').on('blur input', function(e) {
      modelChatInput.text($(this).val()).trigger("blur").trigger("input").trigger("paste")
    })

    $(jNode).closest('div').off().on('click', '.SendButton.chat', function() {
      $('.se-custom-input').val('')
    })
    $('.se-custom-input').on('keydown', function(e) {
        if(e.which == 13) {
          e.preventDefault()
          e.stopImmediatePropagation()
          e.stopPropagation()
          $('.language-chooser').addClass("hidden")
          let submitButton = $(this).parent().parent().find('.SendButton')

          if($('.se-langpicker').attr('data-active')) {

              // only logged in users
              if(!$('.user_information_container').length) {
                  alert("You have to be logged in to send translated messages.")
                  return
              }
              
              translateGoogle($(this).val(), $('.se-langpicker').attr('data-active').toLowerCase(), $('.msg-list-wrapper-split')).then((data) => {
                let trans = decodeHtml(data.data.translations[0].translatedText)
                $(this).val('').focus()
                document.execCommand('insertText', false, trans)
                modelChatInput.text(trans)
                submitButton.click()
              });
          } else {
              // no translation needed
              submitButton.click()
          }
          $('.se-loader-line').remove()
        }
    })


    // hide language chooser on send button && smiles button click
    $('.SendButton.chat').on('click', () => { $('.language-chooser').addClass("hidden"); $(this).closest('.inputDiv').find('.se-custom-input').focus(); })

    // click language button
    $('.se-langpicker').off().on('click', function(e) {

      // split screen
      if(!$('.msg-list-wrapper-split .language-chooser').length) {
        $('.msg-list-wrapper-split').append(htmlLangChooser);
      } else {
        $('.msg-list-wrapper-split .language-chooser').toggleClass('hidden')
      }
      // full screen
      if(!$('.msg-list-wrapper-fvm .language-chooser').length) {
        $('.msg-list-wrapper-fvm').append(htmlLangChooser);
      } else {
        $('.msg-list-wrapper-fvm .language-chooser').toggleClass('hidden')
      }
      
      // add all languages
      populateLanguageDropdowns()
    })
      
    // close language chooser
    $('.window').off().on('click', '.close', function() {
      $(this).closest('.language-chooser').addClass("hidden")
    })

    // reset language on right click
    $(".se-langpicker,.se-langpicker > .flag").on("contextmenu", function() { return false; });
    $('.se-langpicker').on('mousedown', function(e) {
        if( e.button == 2 ) {
          $('.se-langpicker').find('.flag,use').remove()
          $('.language-chooser .flag').removeClass('active')
          $('.se-langpicker').attr('data-active', '')
          localStorage.setItem('prefTranslationLang', "")
          return false;
        }
        return true;
    })

    // select/switch language
    $('.msg-list-wrapper-split').off().on('click', '.language-chooser .flag', function(e) {

        $('.se-langpicker').find('.flag,use').remove()
        if($(this).hasClass('active')) {
            $(this).removeClass('active')
            $('.se-langpicker').attr('data-active', '')
            localStorage.setItem('prefTranslationLang', "")
        } else {
          $('.se-langpicker').prepend($(this).html())
          $('.language-chooser .flag.active').removeClass('active')
          $(this).addClass('active')
          $('.se-langpicker').attr('data-active', $(this).attr('data-lang'))
          localStorage.setItem('prefTranslationLang', $(this).attr('data-lang'))
          $('.language-chooser').addClass("hidden")
        }
    })

    // search language by html attributes
    $('.ChatTabContents').off().on("keyup", ".language-search", function() {
      var value = this.value.toLowerCase().trim();
      if (value.length >= 1) {
          var elem = $(this);
          elem.data('search',  value)
          .clearQueue().stop()
          .queue(function() {
            $(".language-list > button").removeClass('hidden').filter(function() {
                return $(this).attr("data-search").toLowerCase().indexOf(value) === -1;
            }).addClass('hidden');
            if (elem.data('search') !=  value) return;
          });
      } else if (value.length <= 1) {
        $(".language-list button").show();
      }
    });

    // clear search input
    $('.ChatTabContents').on('search', '.language-search', function() {
      if(this.value === "") {
        $(".language-list button").show()
      }
    });

    // fix: Emoji Insert 
    $('body').on('click', '.emojiDiv', function(e) {
      alert("test")
    })
}


/**
 * Auto Tip Button
 */
waitForKeyElements("#sendTipButton", addAutoTipButton, false);
function addAutoTipButton(el) {
  let htmlAutoTipButton = '<span class="auto-tip-button sendTipButton" title="Auto TIP" data-testid="send-tip-button" class="sendTipButton" style="overflow: hidden; line-height: 1.4; height: 24px; font-size: 12px; font-family: UbuntuMedium, Helvetica, Arial, sans-serif; margin: 11px 4px 11px 0px; text-overflow: ellipsis; white-space: nowrap; padding: 3px 10px; box-sizing: border-box; cursor: pointer; display: inline-block; border-width: 1px; border-style: solid;">AUTO TIP</span>'

  // append button
  if(!$('.auto-tip-button').length)
    $(el).after(htmlAutoTipButton)

  // auto tip button handler
  $('.auto-tip-button').on('click', function(e) {
    $('#main > div').append(htmlAutoTipOverlay)
  })

  // send auto tip
  $('.auto-tip-overlay form').on('submit', function(e) {
    e.preventDefault()

    // execute autotip js
    let timeout = xxx; // time between tips in milliseconds
    let tokens = xx; // number of times sent
    let tip_amount = xx; // number of tokens per tip
    let username = "xxxxxxx"; // user to tip
    //eval('for(i=0;i<tokens;i++) { setTimeout(function() { $.post("https://chaturbate.com/tipping/send_tip/" + username + "/", {"csrfmiddlewaretoken":$.cookie("csrftoken"), tip_amount: tip_amount})}, i*timeout)}')
  })
}


/**
 * Model info overlay on listing pages
 */
waitForKeyElements('.favorites .list-items-container', addOverlayButtons);
function addOverlayButtons(jNode) {

  $(jNode).find('[class*="ModelThumbUpper"]').append('<div class="se-model-info model-additional-menu-newtab model-additional-menu model-additional-menu--model-list-item model-list-item-additional-menu-wrapper"><div id="model-additional-menu-button-567" class="model-additional-menu__button">+</div></div>')

  // apapend click handler
  $('.favorites').on('click', '.se-model-info', function(e) {
    e.preventDefault()
    $('.model-list-item .overlay').remove()
    let model = $(this).closest('.model-list-item');
    let username = model.find('[class*="ModelThumbUsername"]').text();
    model.addClass("active")

    // get api data
    $.getJSON('/api/front/v2/models/username/'+username+'/cam').done((data) => {
      this.data = data
      let overlayHtml = htmlModelOverlay

      // replace vars
      const regex = /\[(.*?)\]/g
      let m;
      while ((m = regex.exec(htmlModelOverlay)) !== null) {
        const arrTraverse = m[1].split(".");
        let res = this.data
        $.each(arrTraverse, function(i, v) {
          res = res[v]
        })
        overlayHtml = overlayHtml.replace('['+m[1]+']', res)
      }
      $(this).append(overlayHtml)
    });

    return false;
  })
}


/**
 * Favorites Filtering
 */
waitForKeyElements(".followed_online_offline", addFavoritesFilters, false);
function addFavoritesFilters(el) {

  // add country filter
  if(!$(el).find('.filters-favorites.page-block').length) {

    // add filters block html
    $(el).append(getResource('html/favorites-filters.html'))
  }

  // repopulate country filter on offline/offline click
  $('.followed_online_offline > .title a').on('click', function(e) {
    $('.country select option').not(':first').remove()
    populateCountryFilter()
  })

  // country filter
  populateCountryFilter()
  $('.filters-favorites').on('change', '.country select', function(e) {
    let country = $(this).val().toLowerCase()
    if(country) {
      var filteredCountries = $('.roomCard:not(.hidden)').removeClass('hidden').filter(function() {
        return (!$(this).find('.thumbnail_flag>div>span').length || $(this).find('.thumbnail_flag>div>span').attr('title').toLowerCase().indexOf(country) === -1)
      }).addClass('hidden')
    } else {
      $('.roomCard.hidden').removeClass('hidden')
    }
  })

  // search filter
  $('.filters-favorites').on('input search', '.search input', function(e) {
    let username = $(this).val().toLowerCase()
    if(username) {
      var filteredUsers = $('.roomCard:not(.hidden)').removeClass('hidden').filter(function() {
        return $(this).find('.cardTitle>a').attr('data-room').toLowerCase().indexOf(username) === -1
      }).addClass('hidden');
    } else {
      $('.roomCard.hidden').removeClass('hidden')
    }
  })

  // show all
  $('.filters-favorites').on('click', '.show-all', function(e) {
    $('.model-filter-link').removeClass('active')
    $(this).closest('.model-filter-link').addClass('active')
    $('.model-list-item').removeClass('hidden')
    $('.filters-favorites .search input').val("")
  })

  // in ticket show
  $('.filters-favorites').on('click', '.in-ticket-show', function(e) {
    $('.model-filter-link').removeClass('active')
    $(this).closest('.model-filter-link').addClass('active')
    $('.model-list-item').removeClass('hidden').filter(function() {
      return $(this).find('.icon-ticket').length === 0
    }).addClass('hidden')
  })

  // in group show
  $('.filters-favorites').on('click', '.in-group-show', function(e) {
    $('.model-filter-link').removeClass('active')
    $(this).closest('.model-filter-link').addClass('active')
    $('.model-list-item').removeClass('hidden').filter(function() {
      return $(this).find('.icon-group-ds').length === 0
    }).addClass('hidden')
  })

  // in private show
  $('.filters-favorites').on('click', '.in-private-show', function(e) {
    $('.model-filter-link').removeClass('active')
    $(this).closest('.model-filter-link').addClass('active')
    $('.model-list-item').removeClass('hidden').filter(function() {
      return (
        $(this).find('.model-list-private-badge').text().toLowerCase().indexOf("in private") === -1
        && !$(this).find('[class*="ModelThumbPrivateCover__label"]').length
      )
    }).addClass('hidden')
  })

  // switch grid template
  var cols = localStorage.getItem("SE_gridTemplate")
  if(cols) $('.list.endless_page_template').attr('data-grid', cols)
  $('.filters-favorites').on('click', '.switch-grid-tpl', function(e) {
    e.preventDefault()
    if(!cols) cols = ($('.list.endless_page_template').attr('data-grid') ? $('.list.endless_page_template').attr('data-grid') : 8)
    cols = (parseInt(cols) <= 9 ? parseInt(cols) + 1 : 1)
    updateGridColumns(cols)
  })
  
  $('.filters-favorites').on('contextmenu', '.switch-grid-tpl', function(e) {
    e.preventDefault()
    if(!cols) cols = ($('.list.endless_page_template').attr('data-grid') ? $('.list.endless_page_template').attr('data-grid') : 8)
    cols = (parseInt(cols) > 1 ? parseInt(cols) - 1 : 10)
    updateGridColumns(cols)
  })
}
waitForKeyElements(".followedPage .roomCard", filterFavoritesPageListing, false);
function filterFavoritesPageListing(el) {

  if($(el).find('.filters-favorites .search input').val()) {
    let username = $(this).val().toLowerCase()
    var filteredUsers = $('.roomCard').show().filter(function() {
      return $(this).find('.cardTitle>a').attr('data-room').toLowerCase().indexOf(username) === -1
    }).hide();
  }
}
function updateGridColumns(cols) {
  localStorage.setItem("SE_gridTemplate", cols)
  $('.list.endless_page_template').attr('data-grid', cols)
}
function populateCountryFilter() {
  // populate country filter
  setTimeout(() => {
    $('.roomlist_container:not(.followRecommendations) .roomCard .thumbnail_flag>div>span').each(function() {
      if(!$('.country select').find('select option[value="'+$(this).attr('title')+'"]').length) $('.country select').append('<option value="'+$(this).attr('title')+'">'+$(this).attr('title')+'</option')
    })
  }, 500)
}

/**
 * Global Functions
 */

// Get extension resources
function getResource(path) {
  let data

  $.ajax({
    url:chrome.runtime.getURL(path),
    success: function(html) {
      data = html;
    },
    async: false}
  )
    
  return data
}

// Switch Toggle
waitForKeyElements('#main.chat_room', addBodyShit);
function addBodyShit(el) {

  $(el).on('click', '.se-switcher', function(e) {
    localStorage.setItem($(this).find('input').attr('name'), $(this).find('input').val())
    $(this).toggleClass("on")
    $(this).find('input').prop('checked', function (i, val) {
      return !val;
    }).trigger('change');
  })
}

// Google Cloud Translation API
function translateGoogle(val, lang, errordiv) {
  let data = $.getJSON('https://translation.googleapis.com/language/translate/v2?key='+googleApiKey+'&q='+encodeURIComponent(val)+'&target='+lang.toString().trim()).fail(function(data) {
    data = $.parseJSON(data.responseText)

    // error handling
    if(errordiv && data.error.code) {
      console.log("[StripChat Enhanced] Translation Error: "+data.error.message)
      $(errordiv).append('<div class="model-chat-error"><div class="group-show-in-progress-message m-bg-error message message-base system-text-message system-text-message-error"><div class="message-body"><span class="system-text-message__body"><span class="">[StripChat Enhanced] Translation Error. <em>Please check the browser\'s console (F12) for more information.</small></span></span></div></div></div>')

      // close error
      $('.model-chat-error').on('click', function() { $(this).remove() })
    }
  });

  return data
}

// decode html entities
function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

// populate languages to dropdowns and language lists
function populateLanguageDropdowns() {
  if($('.language-list').empty())
    $.each(iso639_langs, function(key, val) {
      if(val.active === 1 && !$('.language-list.flag-'+val.name).length) {
        $('.language-list').prepend('<button aria-label="'+val.name+'" class="flag flag-'+val.name+'" type="button" title="'+val.name+'" data-search="'+val.name+'|'+val.nativeName+'|'+key+'" data-lang="'+key+'"><svg class="flag flag-'+key+'"><use xlink:href="#'+key+'"></use></svg></button>')
      }
    })
}