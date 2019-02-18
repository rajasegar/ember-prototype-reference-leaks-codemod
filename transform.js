// Press ctrl+space for code completion
export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  root.find(j.ExportDefaultDeclaration).forEach(path => {
    let dec = path.value.declaration;
    let props = dec.arguments[0].properties;

    let initFn = props.filter(p => p.value.type === "FunctionExpression" && p.key.name === "init")[0];

    let initFnBody;
    if(initFn) {
          initFnBody = initFn.value.body.body;
    } else {

      let superCall = j.expressionStatement(j.callExpression(j.memberExpression(j.thisExpression(),j.identifier('_super'),false),[j.identifier('...arguments')]))
      let initProp = j.property("init",j.identifier('init'), j.functionExpression(null,[],j.blockStatement([superCall]),false,false));

      props.push(initProp);
      initFn = props.filter(p => p.value.type === "FunctionExpression" && p.key.name === "init")[0];
      initFnBody = initFn.value.body.body;
    }

    console.log(props);

    let arrExps = props.filter(p => p.value.type === "ArrayExpression");

    // Adding new set expressions for each array expression
    arrExps.forEach(p => {
      console.log(p.key.name);

       let setExp = j.expressionStatement(j.callExpression(j.identifier("set"), [j.identifier("this"), j.identifier(`'${p.key.name}'`), j.arrayExpression(p.value.elements)]));
      initFnBody.push(setExp);
          // Removing array expression values from properties
    props.splice(props.findIndex(p => p.value.type === "ArrayExpression"),1);
  
  
    });

   
  });

  return root.toSource();
}
