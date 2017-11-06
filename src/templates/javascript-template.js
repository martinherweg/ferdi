/*
* Description of what this file is for
*
* @package  <%= projectName %>
<% for (var i=0; i < authors.length; i++) { -%>
* @author <%= authors[i].name %> [<%= authors[i].email %>]
<% } -%>
|--------------------------------------------------------------------------
|  <%= file %>
|--------------------------------------------------------------------------
*/

export default function () {
  console.log('Initialize: <%= moduleName.replace('-', '_') %>');
}
