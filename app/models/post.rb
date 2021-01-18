class Post < ApplicationRecord
    require 'open-uri'
    require 'uri'
    require 'rubygems'
    require 'find'
    require 'json'
    require 'htmlentities'
    require 'contentful/management'

    def self.update_sitemap

        # delete current sitemap
        begin
            File.open('public/sitemap.xml', 'r') do |f|
              # do something with file
              File.delete(f)
            end
          rescue Errno::ENOENT
        end

        posts = Post.all

        builder = Nokogiri::XML::Builder.new do |xml|
            xml.urlset("xmlns" => "http://www.sitemaps.org/schemas/sitemap/0.9") {
                posts.each do |p|
                    xml.url {
                        xml.loc "https://coronanews.ca/coronavirus/news/canada/#{p.title.gsub(/\./,'&#46;')}"
                        xml.lastmod  p.date
                        xml.changefreq 'daily'
                    }
                end
            }
        end
        
        # delete current sitemap
        begin
            File.open('public/sitemap.xml', 'w') do |f|
              f.puts builder.to_xml
            end
          rescue Errno::ENOENT
        end

    end

    # # upsert records
    # def self.sync_database

    #     # make all posts currently featured no longer featured
    #     Post.where(:featured => true).update_all(:featured => false)

    #     client = Contentful::Client.new(
    #         space: '5zy76n4olg5p',
    #         access_token: 'yln9S1YCj8AIS5nH2VqxkQHma2xYmn4n7qRwVviHT2s',
    #         environment: 'master',  # Optional - defaults to 'master'.
    #         dynamic_entries: :auto  # Enables Content Type caching.
    #     )

    #     if ENV['RAILS_ENV'] == 'production' # sync articles based on env
    #         articles = client.entries( :content_type => 'article' ).select { |article| article.fields[:production] }
    #     else 
    #         articles = client.entries( :content_type => 'article' ).select { |article| !(article.fields[:production] ) }
    #     end

    #     articles.each do |article|

    #         found_article = Post.find_or_create_by(
    #             :id => article.raw['sys']['id']
    #         )

    #         found_article.update(
    #             :title => article.raw['fields']['title'],
    #             :tags => article.raw['fields']['tags'],
    #             :headerImg => article.raw['fields']['headerImg'],
    #             :production => article.raw['fields']['production'],
    #             :author => article.raw['fields']['author'],
    #             :source => article.raw['fields']['source'],
    #             :region => article.raw['fields']['region'],
    #             :date => article.raw['fields']['date'],
    #             :sentiment => article.raw['fields']['sentiment'],
    #             :relevance => article.raw['fields']['relevance'],
    #         ) 
    #     end

    #     if ENV['RAILS_ENV'] == 'production' # cleanup articles based on env
    #         Post.where( :production => false ).destroy_all
    #     else 
    #         Post.where( :production => true ).destroy_all
    #     end

    #     # create featured posts based on date
    #     Post.where({ date: (Time.now.midnight - 2.day)..Time.now.midnight }).update_all(:featured => true)
    # end
end
