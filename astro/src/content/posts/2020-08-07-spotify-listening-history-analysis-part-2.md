---
title: "Analyzing my Spotify listening history - Part 2"
date: 2020-08-07
description: "Continuing the Spotify listening history analysis. Exploring genres, correlations, and how my taste has changed over time."
image: "/personal-homepage/posts/spotify-analysis/distribution.png"
categories: ["Analysis", "Music", "BI"]
---

---
aliases:
- /Analysis/Music/BI/2020/08/07/spotify-listening-history-analysis-part-2
author: Bauke Brenninkmeijer
badges: true
branch: master
categories:
- Analysis
- Music
- BI
date: '2020-08-07'
description: In part 2 of this series, we investigate how my genres have developed
  over time. We find interesting pattern with regards to some holidays and a general
  trend towards hip hop. Additionally, we see what some good ways of visualization
  are for these insights.
hide: false
image: images/spotify_analysis/p2/distribution.png
output-file: 2020-08-07-spotify-listening-history-analysis-part-2.html
title: "Analyzing my Spotify listening history \U0001F3B5 - Part 2"
toc: true

---



# Short recap: Part 1
In [part 1](https://www.baukebrenninkmeijer.nl/analysis/music/bi/2020/07/31/spotify-listening-history-analysis-part-1.html) of this series we looked at the first part of this project. This included:
1. The data we are working with and what it looks like. 
2. The amount of listening done per year and per month.
3. The amount of listening done per hour of day, also throughout the years. 
4. The amount of genres we have per song/artist. 

We will continue from where we left of, diving deeper into the genres. 

We'll load up the original JSON from Spotify, as well as the genres we created in part 1. We then combine them into `comb`, the combined dataframe. In `genres.csv`, we again see the 20 columns with the genres for each song, where the genres are collected from the artist, since songs are not labeled as having a genre. For more details, please have a look at part 1.

```python
# data received from Spotify
df.head(1)
```

Genres retrieved from Spotify and the combined dataframe. We rename the genres columns from just a number 0-20 to 'genre_x' with x between 0 and 20, so they're easier to recognize. 

`comb` consists of `df` + `genres_df`, with the genre columns at the end. 

```python
# genres retrieved through Spotify API
genres_df = pd.read_csv('genres.csv', low_memory=False)
genres_df = genres_df.rename(columns={str(x): f'genre_{x}' for x in range(21)})
comb = pd.concat([df, genres_df], axis=1)
comb.head(2)
```

# Top genres

In part 1, we have seen how many genres each song has and how their numbers are distributed. The next question then, naturally, is: What genres are they? So let's see! 

For the following analyses, remember that if I play 10 songs by Kanye, Kanye's genres will be present 10 times.

To analyze the genres, I first create a dataframe that contains all of the genres and their counts. This will be handy in the near future.

```python
top_genres = (
    genres_df.apply(pd.Series.value_counts)
    .apply(np.sum, axis=1)
    .sort_values(ascending=False)
    .reset_index()
    .rename(columns={'index': 'genre', 0: 'count'})
)
```

Then we can plot. Lets start with the total listens per genre. 

<div id="chart-part2-chart1" class="altair-chart"></div>
<script type="module">
import vegaEmbed from 'https://cdn.jsdelivr.net/npm/vega-embed@6/+esm';
const spec = await fetch('/personal-homepage/posts/spotify-analysis/charts/part2-chart1.json').then(r => r.json());
vegaEmbed('#chart-part2-chart1', spec, {actions: false, theme: 'dark'}).catch(console.warn);
</script>

No big surprises here. My main music tastes are hip hop and electronic music, with main genres techno and drum and bass. However, for the latter two I mainly use youtube, which hosts sets that Spotify does not have. So my Spotify is mainly dominated by hip hop and its related genres, like _rap_, _hip hop_ and _pop rap_ (whatever that is? Drake maybe?). I expect many hip hop songs are also tagged as _pop_, which would explain the high _pop_ presence, while I normally am not such a pop fan. Lets dive a bit deeper into this!

As a next step, let's verify which genres coincide with which other genres. This will test our hypothesis that _pop_ is used as a tag for _hip hop_, but will also in general provide us with a better feeling of what genres are related to which other genres. 

For this,we loop over the rows and for each present genre, we put a 1 in that column, while also casting to `np.int8`. This means that, instead of the normally 32 bits, we use 8 bits and thus safe some memory. Since we only wanna represent a binary state (present or not present), we could also use boolean. However, since we're doing arithmetic with it later, int8 will do. We fill the empty cells with 0. We only do this for the top 20 genres. This results in a dataframe with a column for each of the top 20 genres.

```python
rows = []
for i, row in comb.loc[:, [f'genre_{x}' for x in range(21)]].iterrows():
    new_row = {}
    for value in row.values:
        if value in top_genres_20:
            new_row[value] = 1
    rows.append(new_row)
genre_presence = pd.DataFrame(rows)
genre_presence = genre_presence.fillna(0).astype(np.int8)
genre_presence.head(2)
```

Now that we have this data, we can do a correlation analysis of when each genre coincides with what other genre. Now, because genre is a nominal data type, we cannot use the _standard correlation_, which is the __[Pearson correlation coefficient](https://en.wikipedia.org/wiki/Pearson_correlation_coefficient)__. Instead, we should use a metric that works with nominal values. I choose __[Kendall's tau](https://en.wikipedia.org/wiki/Kendall_rank_correlation_coefficient)__ for this, due to its simplicity. Normally, Kendall's tau is meant for _ordinal_ values (variables that have an ordering). However, because we are working with a binary situation (genre is either present or not) represented by 0 and 1, I think this should still work. One other thing to note is that Kendall's tau is _symmetric_, and this means `tau(a, b)` is the same as `tau(b, a)`. 

> **Note:** If you have thoughts on how to do this better, let me know cause I'm definitely open for ideas. 😉

Lets loop over all the combinations of the top 20 genres and compute their tau coefficient.

```python
from scipy.stats import kendalltau
from itertools import product
rows = []
for genre_a, genre_b in product(genre_presence.columns.values, repeat=2):
    tau, p = kendalltau(genre_presence[genre_a].values, genre_presence[genre_b].values)
    rows.append({'genre_a': genre_a, 'genre_b': genre_b, 'tau': tau})
tau_values = pd.DataFrame(rows)
tau_values[:2]
```

For each combination of the top 20 genres, we now know how they are correlated and how much. We can make a nice correlation dataframe from this using the command below. However, because Altair wants data in long format, I won't use that for the visualization. Furthermore, it is very large and won't fit neatly inside the blog :wink:. 

```python
corr = tau_values.pivot(index='genre_a', columns='genre_b', values='tau').fillna(0).style.background_gradient(cmap='coolwarm', axis=None)
corr
```

A much better approach is using Altair, so let's see how these genres correlate then.

<div id="chart-part2-chart2" class="altair-chart"></div>
<script type="module">
import vegaEmbed from 'https://cdn.jsdelivr.net/npm/vega-embed@6/+esm';
const spec = await fetch('/personal-homepage/posts/spotify-analysis/charts/part2-chart2.json').then(r => r.json());
vegaEmbed('#chart-part2-chart2', spec, {actions: false, theme: 'dark'}).catch(console.warn);
</script>

We immediately can see some interesting clusters. We can see a strong tau between most of the electronic music genres, like _edm_, _electro house_, _bass trap_, _big room_, _brostep_ and _electronic trap_. Then, looking at _hip hop_, we can see very strong coefficients with _rap_ and _pop rap_, neither of which are big suprises. My initial hypothesis that _pop_ would be correlated with hip hop has been debunked, though. _Pop_ seems to be more strongly related with _edm_ ($+0.51$) and some other electronic genres, and have a negative tau with hip hop related genres, like _hip hop_ ($-0.29$), _pop rap_ ($-0.28$) and _rap_ ($-0.32$). 

**In this overview, I think there are two interesting insights still:**

- A strong coefficient between _conscious hip hop_ and _west coast rap_. I did not really expect this, but can likely be attributed to artists like Kendrick Lamar, who deal with social and political issues in their lyrics. Additionally, cities like Compton played a big role in west coast hip hop, and were often strongly related to their social and economical situation (Also for Kendrick Lamar).
- A strong coefficient between _G-funk_ and _Detroit hip hop_. G-funk is a is a subgenre of hip hop that originated in the west coast, while Detroit hip hop, as the name says, comes from Detroit. A strong coefficient between _G-funk_ and _west coast rap_ might have been more expected. Interesting to see, but I won't dive deeper into these findings for now. 

# Monthly change in genres 📅
This is a very interesting analysis in my opinion, but also one of the more challenging one. I've approached the problem the following way, given the data I had. 

1. Count the frequency of each genre on a certain interval, monthly in this case.
2. Divide these numbers by the total plays for those intervals, so we get a percentage of total plays of that month. This number means how much of the songs had that genre. This means that these percentages will not sum to one (or you know, they can, but they don't have to). 
3. Sort given these percentages and extract the monthly top 5.

**Step 1**: count the frequency per interval. We don't do this just for the top $n$ genres, but for __all__ genres. This, naturally, results in a lot of columns and a very wide dataframe. 

```python
# Step 1. Count all genre occurences per month.
counters_per_month = []
unique_years = comb.year.sort_values().unique()
unique_months = comb.month.sort_values().unique()
for year, month in tqdm(product(unique_years, unique_months), total=len(unique_years)*len(unique_months)):
    if len(comb.loc[(comb.year == year) & (comb.month == month)]) > 0:
        counter = {'year': year, 'month': month}
        for i, row in comb.loc[(comb.year == year) & (comb.month == month)].iterrows():
            for genre in row[[f'genre_{x}' for x in range(21)]]:  # the genre columns are named '0' to '20'.
                counter[genre] = counter.get(genre, 0) + 1
        counters_per_month.append(counter)
```

Put the `counts_per_month` in a dataframe and calculate the total songs played per month.

```python
counts_per_genre_per_month = pd.DataFrame(counters_per_month)    
monthly_sum = df.groupby(['year', 'month']).size().reset_index().rename(columns={0: 'count'})
```

**Step 2**: We then normalize all genre counts by the number of songs played in that time period. 

```python
# 2.Normalize all genre counts by the number of songs played in that time period. 

# Select all columns except the time columns
columns = counts_per_genre_per_month.columns.tolist()
columns.remove('year')
columns.remove('month')

for i, row in monthly_sum.iterrows():
    counts_per_genre_per_month.loc[(counts_per_genre_per_month.year == row.year) & (counts_per_genre_per_month.month == row.month), columns] = counts_per_genre_per_month.loc[(counts_per_genre_per_month.year == row.year) & (counts_per_genre_per_month.month == row.month), columns] / row['count']
```

To get a cleaner visual, we remove any data before August 2016.

```python
counts_per_genre_per_month_filtered = counts_per_genre_per_month.loc[(counts_per_genre_per_month.year > 2016) | ((counts_per_genre_per_month.year == 2016) & (counts_per_genre_per_month.month > 8))]
```

We now have a dataframe with 863 columns, which corresponds to 861 different genres. This dataframe has all the genres and what percentage of total plays they were present as a genre.  Keep in mind that an artist/song generally has more than one genre, so the sum of these fractions is not 1. This dataframe looks like this: 

```
year  month  east coast hip hop   hip hop       pop   pop rap       rap  \
16  2016      9            0.038760  0.449612  0.387597  0.488372  0.519380   
17  2016     10            0.055409  0.313984  0.343008  0.279683  0.337731   

    trap music        NaN   catstep  ...  classical soprano  spanish hip hop  \
16    0.069767  16.689922  0.007752  ...                NaN              NaN   
17    0.036939  16.469657  0.026385  ...                NaN              NaN   

    trap espanol  pop reggaeton  chinese hip hop  corrido  \
16           NaN            NaN              NaN      NaN   
17           NaN            NaN              NaN      NaN   

    regional mexican pop  australian indigenous  witch house  ghettotech  
16                   NaN                    NaN          NaN         NaN  
17                   NaN                    NaN          NaN         NaN  

[2 rows x 863 columns]
```

**Step 3**: Sort given these values and extract the top 5. Unfortunately, the data is not in a shape that we can do that (to my knowledge at least), so we need to transform it a bit further by moving from a wide to a long data format and filtering out some values. 

The melting of the dataframe results in a single row per percentage per genre per timeunit. This makes it easier to plot with Altair. Furthermore, we create a datetime column from our year + month columns, which is also better for Altair to use. 

```python
counts_per_genre_per_month_melted = pd.melt(counts_per_genre_per_month_filtered, id_vars=['year', 'month'], value_vars=columns, var_name='genre', value_name='percentage')
counts_per_genre_per_month_melted['datetime'] = pd.to_datetime(counts_per_genre_per_month_melted.month.astype(str) + '-' + counts_per_genre_per_month_melted.year.astype(str), format='%m-%Y')
```

Drop columns where either the genre or percentage is Nan. This reduces the number of rows even more, so that taking the n-largest later will be faster. 

```python
counts_per_genre_per_month_melted = counts_per_genre_per_month_melted.dropna(subset=['percentage', 'genre'])
```

```
year  month               genre  percentage   datetime
0  2016      9  east coast hip hop    0.038760 2016-09-01
1  2016     10  east coast hip hop    0.055409 2016-10-01
```

This looks great! But, there is one problem, and that is that we likely have way too many rows for Altair.

```python
counts_per_genre_per_month_melted.shape
```

Welp, so we have almost 7k rows, while Altair's maximum is 5k. Not too bad, but we still need to remove a bunch of rows. But that is fine, since we're only interested in the top 5 of each month anyway. Using `.groupby` and `.nlargest`, we can extract this fairly easy. We extract those the indices of the remaining rows and index into the melted dataframe to only have the rows in the top 5 for each month left. 

```python
top_genres_per_month_with_perc = counts_per_genre_per_month_melted.loc[counts_per_genre_per_month_melted.groupby(['year', 'month']).percentage.nlargest(5).reset_index().level_2.values, :]
top_genres_per_month_with_perc.set_index(['year', 'month']).head(5)
```

```python
top_genres_per_month_with_perc.shape
```

And we only have 145 rows left, so we can use it with Altair 😎.

In the chart below, there is a lot going on. On the x-axis we have time while on the y-axis we have the normalized percentages of the top 5 genres. This means that for each month, the top 5 genres' percentages sum to represent 1. This might be hard to grasp, so I've put the non-normalized one next to this plot to make the difference clear. Some colors are used twice, but there is no color scheme available in Altair that supports more than 20 colors, so this will have to do for now 😉. You can hover over the bars to get details of those bars and click on legenda items to highlight a genre. 

## Top genres with percentages 📊

<div id="chart-part2-chart3" class="altair-chart"></div>
<script type="module">
import vegaEmbed from 'https://cdn.jsdelivr.net/npm/vega-embed@6/+esm';
const spec = await fetch('/personal-homepage/posts/spotify-analysis/charts/part2-chart3.json').then(r => r.json());
vegaEmbed('#chart-part2-chart3', spec, {actions: false, theme: 'dark'}).catch(console.warn);
</script>


There are definitely some interesting things in theses plots. We can see some consistent attendees that we also saw in the most listened genres in general, so that's not a big surprise. For example, these include _rap_, _edm_ and _hip hop_. 

- **Seasonal effects**: What is quite interesting is to see when the very common genres are not dominating the chart, like in December of 2016. Both in November and December of 2016 we see I was in a very strong Christmas mood, with _christmas_ covering 16% of songs in November and 51%(!) in December. The top genres in December are _adult standard_, _easy listening_, _christmas_ and _lounge_. Those definitely are in the same segment, with my listening, so it's not surprising that those other genres appear alongside Christmas in a heavy Christmas month. This is because my Christmas music is more focused on the 40s and 50s, with artists like Frank Sinatra and Dean Martin, rather than Mariah Carey. We do not see this seasonal effect in 2017 and 2018, but those years my Christmas music urge was just less, so this drop is explainable. Instead of Christmas, in December of 2018 _emo rap_ is in my top 5 genres 🤔. That might be interesting to look at in another blog post. 
- **Electronic periods**: Something else that stands out is that there are _electronic music_ periods, like June, July and August of 2017 and January of 2018. However, both _edm_ and _electro house_ are present in essentially each month as high scorers, so I'm definitely a fan in general. But these peak months still stand out. 
- **Rise of Rap**:  The last thing that is interesting is probably the fact that _rap_ and _hip hop_ have almost exclusively been the top 2 from February 2018 to January 2019. This indicates a move away from the more electronic genres and more towards hip hop. A possible reason for this might be the move towards more set-based plays for electronic music, which are generally not on Spotify, but on platforms like Youtube. Otherwise, it might just be an actual preference shift. However, I do still listen to a lot of these types of music, so I suspect the former. Looking at data from 2019 and 2020 might give some insight in this. 

## Top genres without percentages 🏆
So we've seen how the genres relate to each other in terms of percentages per month. We can also see what the top genres are per month, but it can definitely still be improved. I really just want a list with the top 5 genres per month, ideally easily readable and pretty close to the example we had from Last.fm. 

As a reminder, that looked like this:

![Your top genres, plotted per week.](/personal-homepage/posts/spotify-analysis/genre-timeline-lastfm.png "Your top genres, plotted per week. Source: Last.fm")

We can get a list of the top genres per month by grouping and then applying list on the Series. 

```python
top_genres_per_month = top_genres_per_month_with_perc.groupby(['year',  'month']).genre.apply(list).reset_index()
top_genres_per_month[:2]
```

We then create a numpy array from these values and apply them column by column to new dataframe columns.

```python
genre_array = np.stack(top_genres_per_month.genre.values)
for i, new_col in enumerate([f'genre_{x}' for x in range(1, 6)]):
    top_genres_per_month[new_col] = genre_array[:, i]
top_genres_per_month = top_genres_per_month.drop('genre', axis=1)
```

Until we finally arrive at the following dataframe. On the x-axis we have the top 5 genres, named `genre_1` till `genre_5`, while on the y-axis we have months per year. This is pretty much what I set out to do, so I'm happy with the result. 

```python
top_genres_per_month = top_genres_per_month.set_index(['year', 'month']).T
top_genres_per_month
```

However, the lack of color makes interpreting this table still fairly challenging. Let's see if we can improve that a bit. 

To style, we can use the `style` ([docs](https://pandas.pydata.org/pandas-docs/stable/user_guide/style.html)) attribute of `pd.DataFrame`. This is an easy and super handy way of styling dataframes. It has two main methods: `.applymap` and `.apply`. The first one is applied to each cell individually, while the latter is applied to a whole row. That makes `.applymap` well suited for cell specific layouts, like min-max gradients for example, while `.apply` works very well for row-based operations, like highlighting the max. 

To use them, we need to define a coloring function to apply to the dataframe. As a parameter, we give all the unique values. This allows us to create a mapping, as well as define the number of colors required. The colors we use are RGB colors that aren't from the standard coloring libraries, like seaborn [color palette](https://seaborn.pydata.org/tutorial/color_palettes.html). This is because none of their palettes support the number of unique values we have, which is 26. So I used the tool called [i want hue](https://medialab.github.io/iwanthue/), that allows the generation of suitable color palettes. Getting 26 unique colors was still not easy (or a great succes in my opinion), but it works at least semi well. 

```python
import seaborn as sns

colors_26 = [
    "#85cec7",
    "#f398d9",
    "#afe084",
    "#90a9f4",
    "#c0c15c",
    "#74aff3",
    "#e4e88b",
    "#d8afec",
    "#64ddab",
    "#f3a281",
    "#52ebd9",
    "#ebabbe",
    "#9de5a0",
    "#a2b8f0",
    "#e6bb6d",
    "#77cdef",
    "#b8c270",
    "#b6bee4",
    "#9ac68a",
    "#4cd1da",
    "#dfc299",
    "#a0ebe5",
    "#c0c38e",
    "#8cbca8",
    "#d8ebb4",
    "#a7e1c1"
]

def color_cells(val, unique_values):
    """
    Takes a cell value and applies coloring depending on the value. Should be applied to a cell, not a row. So use `.applymap`. If value is unknown, defaults to white. 
    """
    # Multiply with 255 to get into css RGB range (0, 255) instead of (0, 1).
    colors_arr = [tuple(int(y*255) for y in x) for x in sns.color_palette(colors_26)]  
    colormap = [f'rgb{x}' for x in colors_arr]
    colors = {k: v for k, v in zip(unique_values, colormap)}
    color = colors.get(val, 'white')
    return f'background-color: {color}'
```

```python
unique_top_genres = np.unique(top_genres_per_month)  # Get a list of unique values for coloring
top_genres_per_month.style.applymap(color_cells, unique_values=unique_top_genres)
```

Better get the 🚒 cause this table is 🔥. 

This is really close to the Last.fm plot, apart from the lines between points that require 10 years of D3.js experience. We see some similar pattern to those in the earlier plot, but also can see some new insights. Here, we can focus some more on the anomalies that are present, like _indie pop rap_, _dutch hip hop_, _filter house_ and _conscious hip hop_. These stand out more using this representation than before, which focused more on trends. 

**Insights**
- **More electronic peaks**: We can see that February 2017 was actually also a peak in electronic music, but due to similar colors in the previous plot this was a bit hidden. 
- **Pure hip hop periods**: Furthermore, we can also see there are some pure hip hop periods, like April and May of 2017, where EDM and electro house are not present at all, and we see more specific hip hop genres make way like _west coast rap_ and _conscious hip hop_. 

# In conclusion
In part 2 we took a closer look at what genres I listen to and how that has developed over time. There were some very interesting insights, like the effects of holidays, and the change of music preference towards rap. We also recreated the plot from Last.fm, as close as possible at least. I'm quite happy with the outcome, but definitely have some newfound respect for Spotify analysts that have to do this for way more people. Although generalization also brings some advantages of course. Doing these analyses also is improving my skills with Pandas, because I have not previously worked that much with time data, so this is a great exercise. Also, having to look into the details of `.groupby`, and how it operates on timeseries aggregates and what operations are possible were great. For instance, I learned you can do a groupby on a datetime index or column like so:

```python
df.groupby(df['datetime-column'].dt.year)
```

and even multi-index this for month/year using:
```python
df.groupby([df['datetime-column'].dt.year, df['datetime-column'].dt.month])
```

Which is very cool and way cleaner than what I used! But I'm getting sidetracked.

Rounding off; thank you for reading and sticking with me! I'm very curious what results Part 3 will bring. 

**Topics for part 3:**

1. An analysis of musical features, like energy, danceability and acousticness. Those are numeric values and thus allow for some different visualizations then all of the discrete values of this blogpost. 
2. A look into skipping behaviour -> which songs deserve to be skipped. 
3. Which songs do I listen to that are emo rap. This is probably quite a small point of research, but still I'm quite curious.

<p align="center">
	<a href="https://github.com/Baukebrenninkmeijer"><img src="https://img.shields.io/github/followers/Baukebrenninkmeijer.svg?label=GitHub&style=social" alt="GitHub" style="display:inline-block;"></a>
	<a href="https://www.linkedin.com/in/bauke-brenninkmeijer-40143310b"><img src="https://img.shields.io/badge/LinkedIn--_.svg?style=social&logo=linkedin" alt="LinkedIn" style="display:inline-block;"></a>
</p>
