// TODO
// 1. Deal with secondary extend arguments like dec.arguments[1] if it is there
// 2. Need to impletement for Object values apart from arrays
export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);
  const ignoreProps = [
    'classNames', 
    'classNameBindings',
    'attributeBindings',
    'queryParams'
  ];

  root.find(j.ExportDefaultDeclaration).forEach(path => {
    let dec = path.value.declaration;
    if(dec.arguments && dec.arguments[0]) {
      let props = dec.arguments[0].properties;


      if(props) { // If empty properties
        let initFn = props.filter(p => p.value.type === "FunctionExpression" && p.key.name === "init")[0];

        let initFnBody;


        //console.log(props);

        let arrExps = props.filter(p => p.value.type === "ArrayExpression");

        // Adding new set expressions for each array expression
        
        arrExps.filter(p => !ignoreProps.includes(p.key.name)) // Ignoring classNames for components
          .forEach(p => {
          //console.log(p.key.name);
          let setExp = j.expressionStatement(j.callExpression(j.identifier("set"), [j.identifier("this"), j.identifier(`'${p.key.name}'`), j.arrayExpression(p.value.elements)]));
          if(initFn) {
            initFnBody = initFn.value.body.body;
          } else {

            let superCall = j.expressionStatement(j.callExpression(j.memberExpression(j.thisExpression(),j.identifier('_super'),false),[j.identifier('...arguments')]))
            let initProp = j.property("init",j.identifier('init'), j.functionExpression(null,[],j.blockStatement([superCall]),false,false));

            props.push(initProp);
            initFn = props.filter(p => p.value.type === "FunctionExpression" && p.key.name === "init")[0];
            initFnBody = initFn.value.body.body;
          }
          initFnBody.push(setExp);
          // Removing array expression values from properties
          props.splice(props.findIndex(p => p.value.type === "ArrayExpression" && !ignoreProps.includes(p.key.name)),1);

        });

      }
    }

  });

  return root.toSource();
}
