class DropTables < ActiveRecord::Migration[5.2]
  def change
    drop_table :comments
    drop_table :meta
    drop_table :posts
    drop_table :spiders
    drop_table :subscribers
  end
end
