export const schema = {
    document: {
      nodes: [
        {
          match: [
              { type: 'paragraph' },
              { type: 'code' },
              { type: 'quote' },
              { type: 'bulleted-list' },
              { type: 'list-item' },
              { type: 'numbered-list' },
              { type: 'link' },
              { type: 'color' }
            ],
        },
      ],
    },
    blocks: {
      paragraph: {
        nodes: [
          {
            match: { object: 'text' },
          }
        ],
        normalize: (editor, error) => {
            console.log("code: ", error.code)
            switch (error.code) {
              case 'child_object_invalid':
                return editor.wrapBlockByKey(error.child.key, 'paragraph')
              case 'child_type_invalid':
                return editor.setNodeByKey(error.child.key, 'paragraph')
            }
          }
      },
      code: {
          nodes: [
              {
                  match: { object: 'text' }
              }
          ]
      },
      quote: {
          nodes: [
              {
                  match: { object: 'text' }
              }
          ]
      }

    },
    inlines: {
        link: {
            isVoid: true,
            text: string => !string.slice(string.length - 1, string.length).trim(),
            data: {
                href: v => v,
            },
            normalize: (editor, error) => {
                console.log("code: ", error.code )
                if (error.code === 'node_text_invalid') {
                        // editor.insertNodeByKey(
                        //     error.node.key,
                        //     error.node.nodes.size,
                        //     // Text.create({ text: ' ' }),
                        // );
                    }
                },
            nodes: [
                    {
                        match: { object: 'text' }
                    }
                ]
        },
        color: {
            isVoid: true,
            text: string => !string.slice(string.length - 1, string.length).trim(),
            normalize: (editor, error) => {
            if (error.code === 'node_text_invalid') {
                    // editor.insertNodeByKey(
                    //     error.node.key,
                    //     error.node.nodes.size,
                    //     // Text.create({ text: ' ' }),
                    // );
                }
            },
            nodes: [
                {
                    match: { object: 'text' }
                }
            ]
        }
    }
  }