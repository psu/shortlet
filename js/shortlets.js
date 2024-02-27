const all_shortlets = {
  shortlets: [
    {
      id: 'pontus_toggledarklight',
      title: 'Toggle dark/light',
      description: '',
      highlight: {
        color: 'aqua',
        where: 'element/action[0]',
        on: '.button-wrapper',
      },
      url: 'pontus.cc',
      conditions: {
        url: 'text or regex',
        dom: [
          {
            operator: 'value',
          },
          {
            'AND logic': 'between dom condition objects',
          },
          {
            class_exist: ['.table-grid', '.table-grid-2'],
            'OR logic': 'within dom condition objects (same or different operator)',
          },
        ],
      },
      triggers: [
        {
          keyboard: ['ctrl', 'alt', 'delete'],
        },
        {
          commands: ['list', 'number'],
          priority: 10,
        },
      ],
      actions: [
        {
          do: 'click',
          on: '.css-iiu7h7',
          fallback: {
            on: '.css-1jkzc0z',
          },
        },
      ],
    },
    {
      id: 'pontus_goto_about',
      title: 'Goto About',
      url: 'pontus.cc',
      description: '',
      actions: [
        {
          do: 'goto',
          url: '/about',
        },
      ],
    },
    {
      id: 'akeneo_goto_import',
      title: 'Import',
      url: 'akeneo',
      actions: [
        {
          do: 'goto',
          url: '#/collect/import/',
        },
      ],
    },
    {
      id: 'akeneo_goto_entities',
      title: 'Entities',
      url: 'akeneo',
      actions: [
        {
          do: 'goto',
          url: '#/reference_entity',
        },
      ],
    },
    {
      id: 'akeneo_goto_export',
      url: 'akeneo',
      title: 'Export',
      actions: [
        {
          do: 'goto',
          url: '#/spread/export/',
        },
      ],
    },
    {
      id: 'akeneo_reveal_attribute',
      url: 'enrich/product',
      title: 'Show attribute codes',
      actions: [
        {
          do: 'reveal_data',
          on: '.field-container',
          data: 'attribute',
          target: 'label',
          style: 'font-family:SFMono-Regular;font-size:smaller;background:#fbfafb;padding:0 2px;',
        },
      ],
    },
    {
      id: 'akeneo_search',
      url: 'akeneo',
      title: 'Search… - ⌥⌘F',
      actions: [
        {
          do: 'focus',
          on: 'input[placeholder^="Search"]',
        },
      ],
    },
    {
      id: 'akeneo_click_delete',
      url: 'akeneo',
      title: 'Delete ⚠️ - ⌃⇧⌫',
      actions: [
        {
          do: 'click',
          on: 'button',
          text: 'delete',
          fallback: {
            on: '.AknDropdown-menuLink.delete',
          },
        },
      ],
    },
    {
      id: 'akeneo_copy_paste_delete',
      url: 'akeneo',
      title: 'Copy-paste & Delete ⚠️ - ⌃⇧⌫',
      actions: [
        {
          do: 'copy_paste_label',
          on: 'label',
          text: 'Please type "(.+)"',
        },
        {
          do: 'click',
          on: 'button',
          text: 'delete',
        },
      ],
    },
    {
      id: 'akeneo_click_create',
      url: 'akeneo',
      title: 'Create - ⌃⇧R',
      actions: [
        {
          do: 'blur',
        },
        {
          do: 'click',
          on: 'a.AknButton',
          text: '^create',
          fallback: {
            on: 'button',
            text: '^create',
          },
        },
      ],
    },
    {
      id: 'akeneo_click_edit',
      url: 'akeneo',
      title: 'Edit - ⌃⇧E',
      actions: [
        {
          do: 'blur',
        },
        {
          do: 'click',
          on: 'a.AknButton',
          text: '^edit',
          fallback: {
            on: 'button',
            text: '^edit',
          },
        },
      ],
    },
    {
      id: 'akeneo_click_cancel',
      url: 'akeneo',
      title: 'Cancel - ⌃⎋',
      actions: [
        {
          do: 'blur',
        },
        {
          do: 'click',
          on: '.AknFullPage-cancel',
        },
      ],
    },
    {
      id: 'test_input_shortlet',
      url: 'lkasdfj',
      title: 'temp',
      actions: [
        {
          do: 'input',
          on: '#input_58bee2d2-17a4-4258-808d-bb8e9e3a3532',
          text: 'hej',
        },
      ],
    },
    {
      id: 'akeneo_click_save',
      url: 'akeneo',
      title: 'Save - ⌃⇧S',
      actions: [
        {
          do: 'blur',
        },
        {
          do: 'click',
          on: 'button',
          text: '^save',
          fallback: {
            on: 'a.AknButton',
            text: '^save',
          },
        },
        {
          do: 'back',
        },
      ],
    },
    {
      id: 'akeneo_click_stop',
      url: 'akeneo',
      title: 'Stop - ⌃⇧P',
      actions: [
        {
          do: 'blur',
        },
        {
          do: 'click',
          on: 'button',
          text: '^stop',
          fallback: {
            on: 'a.AknButton',
            text: '^stop',
          },
        },
      ],
    },
    {
      id: 'akeneo_delete_all',
      url: 'akeneo',
      title: 'Delete All ⚠️',
      actions: [
        {
          do: 'click_all',
          on: '.AknButtonList--right>[title="Delete"].AknIconButton--trash',
          fallback: {
            on: 'button',
            text: 'delete',
          },
        },
      ],
    },
    {
      id: 'akeneo_list_all_active_acl',
      url: '#/user/role/update',
      title: 'Active ACLs from all tabs',
      actions: [
        {
          do: 'hide',
          on: '.acl-permission:has(.non-granted)',
        },
        {
          do: 'remove_class',
          on: '.tab-pane.fullheight',
          class: 'active AknHorizontalNavtab-item--active AknVerticalNavtab-item--active',
        },
        {
          do: 'add_class',
          on: '.tab-pane.fullheight:has(.granted)',
          class: 'active AknHorizontalNavtab-item--active AknVerticalNavtab-item--active',
        },
      ],
    },
    {
      id: 'akeneo_list_all_inactive_acl',
      url: '#/user/role/update',
      title: 'Inactive ACLs from all tabs',
      actions: [
        {
          do: 'hide',
          on: '.acl-permission:has(.granted)',
        },
        {
          do: 'remove_class',
          on: '.tab-pane.fullheight',
          class: 'active AknHorizontalNavtab-item--active AknVerticalNavtab-item--active',
        },
        {
          do: 'add_class',
          on: '.tab-pane.fullheight:has(.non-granted)',
          class: 'active AknHorizontalNavtab-item--active AknVerticalNavtab-item--active',
        },
      ],
    },
    {
      id: 'akeneo_restore_acl_list',
      url: '#/user/role/update',
      title: 'Restore ACL tabs',
      actions: [
        {
          do: 'show',
          on: '.acl-permission',
          type: 'flex',
        },
        {
          do: 'remove_class',
          on: '.tab-pane.fullheight',
          class: 'active AknHorizontalNavtab-item--active AknVerticalNavtab-item--active',
        },
        {
          do: 'add_class',
          on: '.tab-pane.fullheight:first-of-type',
          class: 'active AknHorizontalNavtab-item--active AknVerticalNavtab-item--active',
        },
      ],
    },
    {
      id: 'akeneo_goto_edit',
      url: 'akeneo',
      title: 'Goto Edit',
      actions: [
        {
          do: 'goto',
          url: '/edit',
          append: true,
        },
      ],
    },
    {
      id: 'akeneo_click_confirm',
      url: 'akeneo',
      title: 'Confirm - ⌃⇧↩',
      actions: [
        {
          do: 'blur',
        },
        {
          do: 'click',
          on: 'button',
          text: 'confirm',
          fallback: {
            on: 'button.AknButton--apply',
          },
        },
      ],
    },
    {
      id: 'maglogin',
      url: 'm2',
      title: 'Maglogin',
      actions: [
        {
          do: 'goto',
          url: 'admin/_autologin',
        },
      ],
    },
    {
      id: 'maglogin_password',
      url: 'm2',
      title: 'Maglogin Temp Password',
      actions: [
        {
          do: 'goto',
          url: "javascript:(function(){var e=new XMLHttpRequest,t=window.location.href.split('#')[0]+'admin/_autologin/_tmppass';e.open('GET',t,!0),e.onreadystatechange=function(){4==e.readyState&&(201==e.status?e.responseText&&prompt(e.responseText,e.responseText.replace(/^.+\\W/g,'')):alert('Not logged in.'))},e.send(null)})();",
        },
      ],
    },
    {
      id: 'magento_click_first_row',
      url: 'm2',
      title: 'Click first row - ⌃⇧→',
      actions: [
        {
          do: 'add_class',
          on: '.data-grid tbody tr',
          class: 'mouseon _clickable',
        },
        {
          do: 'click',
          on: '.data-grid tbody tr._clickable',
        },
      ],
    },
    {
      id: 'magento_delete_attribute',
      url: '/edit/attribute_id',
      title: 'Delete attribute ⚠️ - ⌃⇧⌫',
      actions: [
        {
          do: 'click',
          on: 'button#delete',
        },
        {
          do: 'click',
          on: '.modal-footer button.action-accept',
        },
      ],
    },
    {
      id: 'magento_click_save',
      url: 'm2',
      title: 'Click Save - ⌃⇧↩',
      actions: [
        {
          do: 'click',
          on: 'button#save',
        },
      ],
    },
    {
      id: 'click_all_checkboxes',
      url: 'akeneo',
      title: 'Click all checkboxes',
      actions: [
        {
          do: 'blur',
        },
        {
          do: 'click_all',
          on: 'input[type=checkbox]::before',
        },
      ],
    },
    {
      id: 'check_all_checkboxes',
      url: 'akeneo',
      title: 'Check all checkboxes',
      actions: [
        {
          do: 'blur',
        },
        {
          do: 'html_attribute',
          on: 'input[type=checkbox]',
          name: 'checked',
          value: 'checked',
        },
      ],
    },
    {
      id: 'qlerify_delete_event',
      url: 'app.qlerify',
      title: 'Delete event ⚠️ - ⌃⇧⌫',
      actions: [
        {
          do: 'blur',
          delay: 900,
        },
        {
          do: 'keyboard',
          event: 'keydown',
          key: 'Backspace',
          options: {
            altKey: true,
          },
        },
        {
          do: 'click',
          on: '.confirm-delete-event',
        },
      ],
    },
    {
      id: 'qlerify_delete_event_multiple',
      url: 'app.qlerify',
      title: 'Delete 10 events ⚠️',
      repeat: 10,
      actions: [
        {
          do: 'blur',
          delay: 900,
        },
        {
          do: 'keyboard',
          event: 'keydown',
          key: 'Backspace',
          options: {
            altKey: true,
          },
        },
        {
          do: 'click',
          on: 'button.confirm-delete-event',
        },
      ],
    },
  ],
}
